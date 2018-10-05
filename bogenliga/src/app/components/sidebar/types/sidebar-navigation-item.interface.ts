import {UserPermission} from '../../../modules/shared/services/current-user';

export interface SideBarNavigationItem {
  label: string;
  icon: string;
  route: string;
  permissons?: UserPermission[];
}
