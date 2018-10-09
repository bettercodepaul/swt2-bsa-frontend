import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';
import {UserPermission} from '../../modules/shared/services/current-user';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  { label: 'SIDEBAR.HOME', icon: 'home', route: '/home', permissons: []},
  { label: 'SIDEBAR.VERWALTUNG', icon: 'file_copy', route: '/verwaltung', permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN] },
  { label: 'SIDEBAR.WETTKAMPF', icon: 'play_arrow', route: '/wettkaempfe', permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF] },
  { label: 'SIDEBAR.SPORTJAHRESPLAN', icon: 'today', route: '/sportjahresplan', permissons: [UserPermission.CAN_READ_SPORTJAHR, UserPermission.CAN_MODIFY_SPORTJAHR] },
  { label: 'SIDEBAR.SETTINGS', icon: 'settings', route: '/settings', permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN] }
];
