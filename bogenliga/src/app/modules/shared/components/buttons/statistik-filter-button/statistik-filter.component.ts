import {Component, Input} from '@angular/core';
import {ButtonComponent} from '@shared/components';

@Component({
  selector:    'bla-statistik-filter-button',
  templateUrl: './statistik-filter.component.html',
  styleUrls: ['./statistik-filter.component.scss']
})

export class StatistikFilterComponent extends ButtonComponent {
  @Input() active: boolean;
}
