import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {UserPermission} from '@shared/services';
import {SideBarNavigationSubitem} from './sidebar-navigation-subitem.interface';

export interface SideBarNavigationItem {
  label: string;
  icon: IconDefinition;
  route: string;
  detailType ?: string;
  permissons?: UserPermission[];
  subitems?: SideBarNavigationSubitem[];
  inProdVisible?: boolean;
}
