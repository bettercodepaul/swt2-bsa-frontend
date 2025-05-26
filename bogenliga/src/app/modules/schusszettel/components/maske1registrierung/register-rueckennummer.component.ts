import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { TabletSchusszettel } from '../../models/tablet-schusszettel.model';
import { VerfuegbarerSchuetzeDTO } from '../../types/inside/verfuegbarer-schuetze-dto';

@Component({
  selector: 'bla-maske1registrierung',
  templateUrl: './register-rueckennummer.component.html',
  styleUrls: ['./register-rueckennummer.component.scss']
})
export class RegisterRueckennummerComponent implements OnInit {
  @Input() infos!: TabletSchusszettel;
  @Output() register = new EventEmitter<number[]>();

  form!: FormGroup;
  /** which input slot (0-2) is active */
  activeInputIndex = -1;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('RegisterRueckennummerComponent initialized');

    // Build FormArray of three ID controls + a filter
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

  /** mark slot i as active */
  setActiveInput(i: number): void {
    this.activeInputIndex = i;
    console.log('Active input slot set to', i);
  }

  /** when user clicks a shooter, fill the active slot */
  selectShooter(sh: VerfuegbarerSchuetzeDTO): void {
    if (this.activeInputIndex < 0) {
      return;
    }
    const ctrl = this.ids.at(this.activeInputIndex);
    ctrl.setValue(sh.schuetzenId.toString());
    ctrl.markAsTouched();
    console.log(`Inserted shooterId=${sh.schuetzenId} into slot ${this.activeInputIndex}`);
  }

  /** filter the shooter list by ID or name */
  get filteredShooters(): VerfuegbarerSchuetzeDTO[] {
    const term = this.filterControl.value.toLowerCase();
    return this.infos.verfuegbareSchuetzen.filter((sh) =>
      sh.name.toLowerCase().includes(term) ||
      sh.schuetzenId.toString().includes(term)
    );
  }

  /** trackBy for performance */
  trackById(_: number, sh: VerfuegbarerSchuetzeDTO): number {
    return sh.schuetzenId;
  }

  /** submit three numeric IDs */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('Invalid Rückennummer form:', this.form.value);
      return;
    }
    const values = this.ids.value.map((v: string) => Number(v));
    console.log('Submitting Rückennummern:', values);
    this.register.emit(values);
  }
}
