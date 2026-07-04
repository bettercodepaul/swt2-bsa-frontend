import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {UserPermission} from '@shared/services';
import {SideBarNavigationSubitem} from './sidebar-navigation-subitem.interface';

export interface SideBarNavigationItem {
  label: string;
  icon: IconDefinition;
  route: string;
  // Externe URL (z. B. Doku): wird in der Navbar in einem neuen Tab geöffnet statt intern zu routen.
  externalUrl?: string;
  detailType ?: string;
  permissons?: UserPermission[];
  subitems?: SideBarNavigationSubitem[];
  inProdVisible?: boolean;
  datacy: string;
  requiresLigaContext?: boolean;
}
