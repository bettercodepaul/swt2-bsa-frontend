import {UserPermission} from '@shared/services';

export interface SideBarNavigationSubitem {
  label: string;
  route: string;
  permissons?: UserPermission[];
  datacy: string;
}
