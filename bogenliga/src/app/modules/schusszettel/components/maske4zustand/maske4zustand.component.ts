import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import { CurrentUserService, UserPermission } from '@shared/services';

@Component({
  selector: 'bla-maske4zustand',
  templateUrl: './maske4zustand.component.html',
  styleUrls: ['./maske4zustand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Maske4ZustandComponent {
  @Input() infos: TabletSchusszettel | null = null;
  @Output() weiter = new EventEmitter<void>();

  constructor(private currentUserService: CurrentUserService) {}

  canViewSchusszettel(): boolean {
    return this.currentUserService.hasPermission(UserPermission.CAN_READ_MY_VERANSTALTUNG);
  }

  onWeiter(): void {
    this.weiter.emit();
  }
}
