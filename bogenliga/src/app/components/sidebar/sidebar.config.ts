import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';
import {UserPermission} from '../../modules/shared/services/current-user';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  { label: 'SIDEBAR.HOME', icon: 'home', route: '/home', permissons: []},
  { label: 'SIDEBAR.VERWALTUNG', icon: 'file_copy', route: '/verwaltung', permissons: [] },
  { label: 'SIDEBAR.WETTKAMPF', icon: 'play_arrow', route: '/wettkaempfe', permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF] },
  { label: 'SIDEBAR.SPORTJAHRESPLAN', icon: 'today', route: '/sportjahresplan', permissons: [] },
  { label: 'SIDEBAR.SETTINGS', icon: 'settings', route: '/settings', permissons: [] }
];
