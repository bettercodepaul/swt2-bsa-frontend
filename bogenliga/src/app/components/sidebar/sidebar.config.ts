import {UserPermission} from '@shared/services';
import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';

import {
  faArchive,
  faBullseye,
  faCalendarAlt,
  faFootballBall,
  faHome,
  faListOl,
  faSitemap,
  faUsers,
  faBinoculars
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
    icon:       faBullseye,
    route: '/regionen',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label: 'SIDEBAR.VEREINE',
    icon: faUsers,
    route: '/vereine',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label:      'SIDEBAR.VERWALTUNG',
    icon:       faArchive,
    route:      '/verwaltung',
    permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
    subitems: [
      {
        label:      'DSB Mitglieder',
        route:      '/verwaltung/dsbmitglieder',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label: 'Benutzer',
        route: '/verwaltung/benutzer',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        label:      'Klassen',
        route:      '/verwaltung/klassen',
        permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF]
      },
      {
        label:      'Vereine',
        route:      '/verwaltung/vereine',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label:      'Ligen',
        route:      '/verwaltung/liga',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label:      'Regionen',
        route:      '/verwaltung/region',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label:    'Veranstaltungen',
        route:    '/verwaltung/veranstaltung',
        permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF]
      }
    ]
  },
  {
    label:      'SIDEBAR.WETTKAMPF',
    icon:       faSitemap,
    route:      '/wettkaempfe',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label:      'SIDEBAR.SPORTJAHRESPLAN',
    icon:       faCalendarAlt,
    route:      '/sportjahresplan',
    permissons: [UserPermission.CAN_READ_WETTKAMPF],
    subitems: []
  },
  {
    label:      'SIDEBAR.MANNSCHAFTEN',
    icon:       faListOl,
    route:      '/ligatabelle',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label:      'SIDEBAR.SPOTTING',
    icon:       faBinoculars,
    route:      '/spotter',
    permissons: [UserPermission.CAN_MODIFY_WETTKAMPF],
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
