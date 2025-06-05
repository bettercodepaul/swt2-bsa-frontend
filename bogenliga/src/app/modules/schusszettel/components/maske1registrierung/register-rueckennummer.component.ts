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
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'bla-maske1registrierung',
  templateUrl: './register-rueckennummer.component.html',
  styleUrls: ['./register-rueckennummer.component.scss']
})
export class RegisterRueckennummerComponent implements OnChanges, OnInit, OnDestroy {
  @Input() infos!: TabletSchusszettel;
  @Output() register = new EventEmitter<number[]>();

  form!: FormGroup;
  activeInputIndex = -1;
  private formBuilt = false;

  constructor(private fb: FormBuilder, private app: AppComponent) {}

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
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }

  private buildForm(): void {
    this.form = this.fb.group({
      filter: [''],
      ids: this.fb.array(
        Array(3).fill(null).map(() =>
          this.fb.control('', [
            Validators.required,
            Validators.pattern(/^[0-9]+$/)
          ])
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

  selectShooter(sh: SchuetzeStammdatenDTO): void {
    if (this.activeInputIndex < 0) {
      return;
    }
    const ctrl = this.ids.at(this.activeInputIndex);
    ctrl.setValue(sh.rueckennummer.toString());
    ctrl.markAsTouched();
  }

  get filteredShooters(): SchuetzeStammdatenDTO[] {
    if (!this.infos?.schuetzeStammDaten) {
      return [];
    }
    const term = this.filterControl.value.toLowerCase().trim();
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

  onSubmit(): void {
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const rnums: number[] = this.ids.value.map((v: string) => Number(v));
    const mappedIds: (number | null)[] = rnums.map((rn) => {
      const found = this.infos.schuetzeStammDaten.find(
        (sh) => sh.rueckennummer === rn
      );
      return found ? found.schuetzenId : null;
    });

    const invalidIdx = mappedIds.findIndex((id) => id === null);
    if (invalidIdx > -1) {
      return;
    }

    this.register.emit(mappedIds as number[]);
  }
}
