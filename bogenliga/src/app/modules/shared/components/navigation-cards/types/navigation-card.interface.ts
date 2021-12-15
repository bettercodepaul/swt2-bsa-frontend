import {UserPermission} from '@shared/services';

export interface NavigationCard {
  labelKey: string;
  descriptionKey: string;
  icon: string;
  route: string;
  permissions?: UserPermission[];
  detailType ?: string;
  datacy: string;
}
