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
  activeInputIndex = 0;
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
      filter: [''],
      //In den Slots speichern wir direkt die schuetzenId (oder null)
      ids: this.fb.array(
        Array(3)
          .fill(null)
          .map(() =>
            this.fb.control(null, Validators.required)
          )
      )
    });
  }

  get ids(): FormArray {
    return this.form.get('ids') as FormArray;
  }

  get filterControl() {
    return this.form.get('filter')!;
  }

  setActiveInput(i: number): void {
    this.activeInputIndex = i;
  }

  //Gefilterte Schützenliste (Name oder Rückennummer)
  get filteredShooters(): SchuetzeStammdatenDTO[] {
    if (!this.infos?.schuetzeStammDaten) {
      return [];
    }
    const raw = this.filterControl.value;
    const term = (raw || '').toString().toLowerCase().trim();
    if (!term) {
      return this.infos.schuetzeStammDaten;
    }
    return this.infos.schuetzeStammDaten.filter((sh) => {
      const fullName = `${sh.vorname} ${sh.nachname}`.toLowerCase();
      return (
        fullName.includes(term) ||
        sh.rueckennummer.toString().includes(term)
      );
    });
  }

  trackById(_: number, sh: SchuetzeStammdatenDTO): number {
    return sh.schuetzenId;
  }

  //Schützenobjekt für einen Slot holen
  getShooterForSlot(i: number): SchuetzeStammdatenDTO | undefined {
    if (!this.infos?.schuetzeStammDaten) {
      return undefined;
    }
    const ctrl = this.ids.at(i);
    const id = ctrl.value as number | null;
    if (id == null) {
      return undefined;
    }
    return this.infos.schuetzeStammDaten.find(
      (sh) => sh.schuetzenId === id
    );
  }

  //Slot leeren
  clearSlot(i: number): void {
    const ctrl = this.ids.at(i);
    ctrl.setValue(null);
    ctrl.markAsTouched();
  }

  //Schützen aus der Liste in aktiven Slot setzen
  selectShooter(sh: SchuetzeStammdatenDTO): void {
    if (!this.form) {
      return;
    }

    const currentIds = this.ids.value as (number | null)[];

    //Wenn Schütze bereits eingetragen ist → Slot aktivieren
    const existingIndex = currentIds.indexOf(sh.schuetzenId);
    if (existingIndex !== -1) {
      this.activeInputIndex = existingIndex;
      return;
    }

    //Falls noch kein Slot gewählt wurde, ersten freien Slot suchen
    if (this.activeInputIndex < 0) {
      const freeIndex = currentIds.findIndex((id) => id === null);
      this.activeInputIndex = freeIndex !== -1 ? freeIndex : 0;
    }

    const ctrl = this.ids.at(this.activeInputIndex);
    ctrl.setValue(sh.schuetzenId);
    ctrl.markAsTouched();
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

    //optional: Duplikate verhindern
    const unique = new Set(nonNullIds);
    if (unique.size !== nonNullIds.length) {
      //hier könntest du noch eine eigene Fehlermeldung setzen
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
