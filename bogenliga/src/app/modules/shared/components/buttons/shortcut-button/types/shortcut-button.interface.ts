import {UserPermission} from '@shared/services';

export interface ShortcutButtonInterface {

  title:string;
  icon: string;
  route: string;
  permissions?: UserPermission[];
  roles?: string[];

}
