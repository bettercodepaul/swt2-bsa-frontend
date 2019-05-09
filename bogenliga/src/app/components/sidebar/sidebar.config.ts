import {UserPermission} from '@shared/services';
import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';

import {
  faAirFreshener,
  faArchive,
  faBullseye,
  faCalendarAlt,
  faFootballBall,
  faHome,
  faSitemap, faUsers, faUsersCog
} from '@fortawesome/free-solid-svg-icons';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  {
    label: 'SIDEBAR.HOME',
    icon: faHome,
    route: '/home',
    permissons: [],
    subitems: []
  },
  {
    label: 'SIDEBAR.REGIONEN',
    icon: faSitemap,
    route: '/regionen',
    permissons: [],
    subitems: []
  },
  {
    label: 'SIDEBAR.VEREINE',
    icon: faUsers,
    route: '/vereine',
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
      },
      {
        label: 'Benutzer',
        route: '/verwaltung/benutzer',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        label:      'Klassen',
        route:      '/verwaltung/klassen',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        label:      'Vereine',
        route:      '/verwaltung/vereine',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        label:      'Ligen',
        route:      '/verwaltung/liga',
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
    label: 'SIDEBAR.PLAYGROUND',
    icon: faFootballBall,
    route: '/playground',
    permissons: [],
    subitems: [],
    inProdVisible: false
  }
];
