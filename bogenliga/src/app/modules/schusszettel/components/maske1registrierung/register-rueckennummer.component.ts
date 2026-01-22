import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabletSchusszettel } from '../../models/tablet-schusszettel.model';
import { SchuetzeStammdatenDTO } from '../../types/inside/schuetze-stammdaten-dto';
import { ShooterOrderService } from '../../services/shooter-order.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'bla-maske1registrierung',
  templateUrl: './register-rueckennummer.component.html',
  styleUrls: ['./register-rueckennummer.component.scss']
})
export class RegisterRueckennummerComponent
  implements OnChanges, OnInit, OnDestroy {

  @Input() infos!: TabletSchusszettel;
  @Output() register = new EventEmitter<number[]>();

  form!: FormGroup;
  private formBuilt = false;

  //Status für Bestätigungs-Schritt + zwischengespeicherte IDs
  confirmStep = false;
  private pendingIds: number[] | null = null;

  constructor(
    private fb: FormBuilder,
    private app: AppComponent,
    private shooterOrderService: ShooterOrderService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['infos'] &&
      this.infos?.schuetzeStammDaten?.length > 0 &&
      !this.formBuilt
    ) {
      this.buildForm();
      this.formBuilt = true;
    }
  }

  ngOnInit(): void {
    //Navbar und Footer ausblenden
    this.app.fullscreen = true;
  }

  ngOnDestroy(): void {
    //Beim Verlassen wieder anzeigen
    this.app.fullscreen = false;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      //3 feste Positionen: Menü 1, 2, 3 -> ids[0..2]
      ids: this.fb.array(
        Array(3)
          .fill(null)
          .map(() => this.fb.control(null, Validators.required))
      )
    });
  }
  get menuSize(): number {
    const count = this.infos?.schuetzeStammDaten?.length ?? 0;

    //+1 wegen "Schützen auswählen…" Platzhalter
    //max 4 Zeilen hoch -> ab 4 Schützen scrollbar
    return Math.min(count + 1, 4);
  }

  get ids(): FormArray {
    return this.form.get('ids') as FormArray;
  }

  trackById(_: number, sh: SchuetzeStammdatenDTO): number {
    return sh.schuetzenId;
  }

  //Hilfsfunktion: gewählte IDs (ohne null)
  private getSelectedIds(): number[] {
    const values = this.ids.value as (number | null)[];
    return values.filter((v): v is number => v != null);
  }

  //Duplikate verhindern: Option in anderen Menüs deaktivieren
  isDisabledOption(shId: number, currentIndex: number): boolean {
    const values = this.ids.value as (number | null)[];
    return values.some((v, idx) => idx !== currentIndex && v === shId);
  }

  //1. Klick auf "BESTÄTIGEN": validieren und Bestätigungsbox anzeigen
  onSubmit(): void {
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const idsValue = this.ids.value as (number | null)[];
    if (idsValue.includes(null)) {
      this.form.markAllAsTouched();
      return;
    }

    const nonNullIds = idsValue as number[];

    // Duplikate verhindern (sicherheitshalber auch backendseitig prüfen)
    const unique = new Set(nonNullIds);
    if (unique.size !== nonNullIds.length) {
      return;
    }

    //IDs zwischenspeichern und Bestätigungsbox anzeigen
    this.confirmStep = true;
    this.pendingIds = nonNullIds;
  }

  //Klick auf "Ja, endgültig bestätigen"
  finalizeSubmit(): void {
    if (!this.pendingIds) {
      return;
    }
    this.register.emit(this.pendingIds);
    this.confirmStep = false;
    this.pendingIds = null;
  }

  //Klick auf "Abbrechen" in der Bestätigungsbox
  cancelConfirm(): void {
    this.confirmStep = false;
    this.pendingIds = null;
  }
}
