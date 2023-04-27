import {UserPermission} from '@shared/services';
import {UserRoleEnum} from '@shared/services/current-user/types/user-role.enum';

export interface ShortcutButtonInterface {

  title:string;
  icon: string;
  route: string;
  permissions?: UserPermission[];
  roles?: UserRoleEnum[];

}
