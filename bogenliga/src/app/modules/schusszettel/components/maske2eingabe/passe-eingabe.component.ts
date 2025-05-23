import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { TabletSchusszettel } from '../../models/tablet-schusszettel.model';
import { SchuetzenSatzDTO } from '../../types/datatransfer/satz-eingabe-dto';
import { Subject } from 'rxjs';

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

  constructor(private fb: FormBuilder) {}

  /** compute the active passe based on history */
  public get currentPasse(): number {
    return this.infos.satzErgebnisse.length + 1;
  }

  ngOnInit(): void {
    console.log('Initializing PasseEingabeComponent, currentPasse=', this.currentPasse);

    // create one FormGroup per shooter
    const groups = this.infos.schuetzeStammDaten.map(() =>
      this.fb.group({
        schuss1: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
        schuss2: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
        schuss3: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      })
    );

    this.form = this.fb.group({ schuesse: this.fb.array(groups) });
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

  /** trackBy shooter ID for performance */
  trackByShooter(_: number, __: any): number {
    return this.infos.schuetzeStammDaten[_].schuetzenId;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('Form invalid, cannot submit', this.form.value);
      return;
    }

    const payload: SchuetzenSatzDTO[] = this.infos.schuetzeStammDaten.map((s, i) => {
      const grp = this.schuesse.at(i) as FormGroup;
      return {
        schuetzenId: s.schuetzenId,
        schuss1: grp.value.schuss1,
        schuss2: grp.value.schuss2,
        schuss3: grp.value.schuss3,
      };
    });

    console.log('Emitting satzeingabe payload:', payload);
    this.satzSubmit.emit(payload);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
