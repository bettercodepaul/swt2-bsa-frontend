import {UserPermission} from '../../../modules/shared/services/current-user';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';

export interface SideBarNavigationSubitem {
  label: string;
  route: string;
  permissons?: UserPermission[];
}
