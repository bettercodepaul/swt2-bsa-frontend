import {UserPermission} from '../../../modules/shared/services/current-user';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';

export interface SideBarNavigationItem {
  label: string;
  icon: IconDefinition;
  route: string;
  permissons?: UserPermission[];
}
