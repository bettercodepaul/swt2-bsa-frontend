import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {SchuetzenSatzDTO} from '../../types/datatransfer/satz-eingabe-dto';
import {SchuetzeStammdatenDTO} from '../../types/inside/schuetze-stammdaten-dto';
import {ShooterOrderService} from '../../services/shooter-order.service';
import {Subject} from 'rxjs';
import {AppComponent} from 'src/app/app.component';
import {QueryList, ViewChildren, ElementRef} from '@angular/core';

@Component({
  selector: 'bla-maske2eingabe',
  templateUrl: './passe-eingabe.component.html',
  styleUrls: ['./passe-eingabe.component.scss']
})
export class PasseEingabeComponent implements OnInit, OnDestroy {
  @Input() infos!: TabletSchusszettel;
  @Output() satzSubmit = new EventEmitter<SchuetzenSatzDTO[]>();
  form!: FormGroup;
  activeRow = -1;
  private destroy$ = new Subject<void>();
  timeoutId: any = null;

  orderedShooters: SchuetzeStammdatenDTO[] = [];

  constructor(
    private fb: FormBuilder, 
    private app: AppComponent,
    private shooterOrderService: ShooterOrderService
  ) {}

  @ViewChildren('inputField') inputFields: QueryList<ElementRef>;

  getInputElement(field: string, i: number): ElementRef | undefined {
    const id = `${field}-${i}`;
    return this.inputFields.find((ref) => ref.nativeElement.id === id);
  }
  /** Compute the current passe */
  public get currentPasse(): number {
    // Use backend-provided currentPasseNumber if available, fallback to local calculation
    if (this.infos?.currentPasseNumber != null) {
      console.log('Using backend-provided currentPasseNumber:', this.infos.currentPasseNumber);
      return this.infos.currentPasseNumber;
    }
    
    // Fallback to local calculation for backward compatibility
    const completedPasses = this.infos?.satzErgebnisse?.length || 0;
    const nextPasse = completedPasses + 1;
    console.log('Calculated next passe:', nextPasse, 'from completed passes:', completedPasses);
    return nextPasse;
  }

  ngOnInit(): void {
    console.log('=== DEBUGGING PASSE EINGABE ===');
    console.log('Full infos object:', this.infos);
    console.log('schuetzeStammDaten:', this.infos?.schuetzeStammDaten);
    console.log('schuetzeStammDaten length:', this.infos?.schuetzeStammDaten?.length);

    if (this.infos?.schuetzeStammDaten) {
      this.infos.schuetzeStammDaten.forEach((schuetze, index) => {
        console.log(`Shooter ${index}:`, {
          id: schuetze.schuetzenId,
          name: `${schuetze.vorname} ${schuetze.nachname}`,
          rueckennummer: schuetze.rueckennummer
        });
      });
    }

    console.log('currentPasse=', this.currentPasse);

    // Safety check: ensure schuetzeStammDaten exists and has data
    if (!this.infos?.schuetzeStammDaten || this.infos.schuetzeStammDaten.length === 0) {
      console.error('schuetzeStammDaten is missing or empty!', this.infos);
      return;
    }

    // Apply saved shooter order
    this.orderedShooters = this.shooterOrderService.applyShooterOrder(
      this.infos.schuetzeStammDaten,
      this.infos.eigenesTeam.teamId,
      this.infos.wettkampfInfo?.wettkampfId || 0
    );

    // Log how many form groups we're creating
    console.log('Creating', this.orderedShooters.length, 'form groups');

    // create one FormGroup per shooter - only 2 arrows per shooter (matching backend ARROWS_PER_SHOOTER = 2)
    const groups = this.orderedShooters.map((schuetze, index) => {
      console.log(`Creating form group ${index} for shooter ${schuetze.schuetzenId}`);
      return this.fb.group({
        schuss1: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
        schuss2: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      });
    });

    console.log('Created', groups.length, 'form groups');
    this.form = this.fb.group({ schuesse: this.fb.array(groups) });
    console.log('Form created with schuesse array length:', this.schuesse.length);
    console.log('=== END DEBUGGING ===');
    this.app.fullscreen = true; // Navbar & Footer ausblenden
  }

  get schuesse(): FormArray {
    return this.form.get('schuesse') as FormArray;
  }

  /** highlight row i */
  onFocusRow(i: number): void {
    this.activeRow = i;
    console.log('Row focused:', i);
  }

  /** clear highlight */
  onBlurRow(): void {
    this.activeRow = -1;
    console.log('Row blur, clearing highlight');
  }

  /** trackBy shooter ID for performance with safety checks */
  trackByShooter(index: number, _: any): number {
    // Use the ordered shooters array
    if (this.orderedShooters && this.orderedShooters[index]) {
      return this.orderedShooters[index].schuetzenId;
    }
    // Fallback to index if data is not available
    return index;
  }

  onRowDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      // Reorder the shooters array
      this.orderedShooters = this.shooterOrderService.reorderShooters(
        this.orderedShooters,
        event.previousIndex,
        event.currentIndex
      );

      // Reorder the form array
      const formArray = this.schuesse;
      const item = formArray.at(event.previousIndex);
      formArray.removeAt(event.previousIndex);
      formArray.insert(event.currentIndex, item);

      // Save the new order
      const shooterIds = this.orderedShooters.map(s => s.schuetzenId);
      this.shooterOrderService.saveShooterOrder(
        this.infos.eigenesTeam.teamId,
        this.infos.wettkampfInfo?.wettkampfId || 0,
        shooterIds
      );
    }
  }

  onSubmit(): void {
    if (!this.orderedShooters || this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('Form invalid or missing data, cannot submit', this.form.value);
      return;
    }

    // Create payload matching updated SchuetzenSatzDTO (only 2 arrows per shooter)
    // Use orderedShooters to maintain correct schützenId mapping
    const payload: SchuetzenSatzDTO[] = this.orderedShooters.map((s, i) => {
      const grp = this.schuesse.at(i) as FormGroup;
      return {
        schuetzenId: s.schuetzenId,
        schuss1: grp.value.schuss1,
        schuss2: grp.value.schuss2,
        // No schuss3 - only 2 arrows per shooter to match backend ARROWS_PER_SHOOTER = 2
      };
    });
    console.log('Emitting satzeingabe payload:', payload);
    this.satzSubmit.emit(payload);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.app.fullscreen = false; // Beim Verlassen wieder (footer und header) einblenden
  }


  onInputDelay(i: number, field: 'schuss1' | 'schuss2') {
    // Clear alten Timer
    clearTimeout(this.timeoutId);

    // Starte neuen Timer
    this.timeoutId = setTimeout(() => {
      const inputEl = this.getInputElement(field, i);
      const value = parseInt(inputEl?.nativeElement.value || '', 10);

      // Nur wenn Wert gültig ist: Feld wechseln
      if (!isNaN(value) && value >= 0 && value <= 10) {
        this.focusNextField(i, field);
      } else {
        console.warn('Ungültiger Wert – kein automatischer Wechsel:', value);
      }
    }, 700);
  }

  focusNextField(i: number, field: 'schuss1' | 'schuss2') {
    const nextFieldId =
      field === 'schuss1'
        ? `schuss2-${i}`
        : `schuss1-${i + 1}`; // zum nächsten Schützen

    const nextInput = this.inputFields.find((ref) => ref.nativeElement.id === nextFieldId);
    if (nextInput) {
      nextInput.nativeElement.focus();
    }
  }
}
