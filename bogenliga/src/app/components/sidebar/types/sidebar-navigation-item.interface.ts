import {UserPermission} from '../../../modules/shared/services/current-user';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {SideBarNavigationSubitem} from './sidebar-navigation-subitem.interface';

export interface SideBarNavigationItem {
  label: string;
  icon: IconDefinition;
  route: string;
  permissons?: UserPermission[];
  subitems?: SideBarNavigationSubitem[];
  inProdVisible?: boolean;
}
