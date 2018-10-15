import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';
import {UserPermission} from '../../modules/shared/services/current-user';

import {faArchive, faBullseye, faCalendarAlt, faCog, faHome} from '@fortawesome/free-solid-svg-icons';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  {
    label: 'SIDEBAR.HOME',
    icon: faHome,
    route: '/home',
    permissons: [],
    subitems: []
  },
  {
    label:      'SIDEBAR.VERWALTUNG',
    icon:       faArchive,
    route:      '/verwaltung',
    permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
    subitems: [
      {
        label:      'DSB Mitglieder',
        route:      '/verwaltung/dsbmitglieder',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      }
    ]
  },
  {
    label:      'SIDEBAR.WETTKAMPF',
    icon:       faBullseye,
    route:      '/wettkaempfe',
    permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF],
    subitems: []
  },
  {
    label:      'SIDEBAR.SPORTJAHRESPLAN',
    icon:       faCalendarAlt,
    route:      '/sportjahresplan',
    permissons: [UserPermission.CAN_READ_SPORTJAHR, UserPermission.CAN_MODIFY_SPORTJAHR],
    subitems: []
  },
  {
    label:      'SIDEBAR.SETTINGS',
    icon:       faCog,
    route:      '/settings',
    permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
    subitems: []
  }
];
