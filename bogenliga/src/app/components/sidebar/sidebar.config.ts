import {UserPermission} from '@shared/services';
import {SideBarNavigationItem} from './types/sidebar-navigation-item.interface';

import {
  faArchive,
  faBinoculars,
  faBullseye,
  faCalendarAlt,
  faFootballBall,
  faHome,
  faListOl,
  faSitemap,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
  {
    label: 'SIDEBAR.HOME',
    icon: faHome,
    route: '/home',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label: 'SIDEBAR.REGIONEN',
    icon: faBullseye,
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
    label: 'SIDEBAR.VERWALTUNG',
    icon: faArchive,
    route: '/verwaltung',
    permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
    subitems: [
      {
        label: 'DSB Mitglieder',
        route: '/verwaltung/dsbmitglieder',
        //TODO: Should it be UserPermission.CAN_READ_DBSMITGLIEDER ??
        // see https://www.exxcellent.de/confluence/display/BSAPP/Rollentabelle --> Sportleiter
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label: 'Benutzer',
        route: '/verwaltung/benutzer',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN]
      },
      {
        label: 'Klassen',
        route: '/verwaltung/klassen',
        permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF]
      },
      {
        label: 'Vereine',
        route: '/verwaltung/vereine',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label: 'Ligen',
        route: '/verwaltung/liga',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label: 'Regionen',
        route: '/verwaltung/region',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN]
      },
      {
        label: 'Veranstaltungen',
        route: '/verwaltung/veranstaltung',
        permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF]
      }
    ]
  },
  {
    label: 'SIDEBAR.WETTKAMPF',
    icon: faSitemap,
    route: '/wettkaempfe',
    //TODO: Should be User.Permission.CAN_READ_DEFAULT
    // see https://www.exxcellent.de/confluence/display/BSAPP/Rollentabelle --> Anonymous
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label: 'SIDEBAR.SPORTJAHRESPLAN',
    icon: faCalendarAlt,
    route: '/sportjahresplan',
    permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF],
    subitems: []
  },
  {
    label: 'SIDEBAR.MANNSCHAFTEN',
    icon: faListOl,
    route: '/ligatabelle',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: []
  },
  {
    label: 'SIDEBAR.SPOTTING',
    icon: faBinoculars,
    route: '/spotter',
    permissons: [UserPermission.CAN_OPERATE_SPOTTING],
    subitems: []
  },
  {
    label: 'SIDEBAR.PLAYGROUND',
    icon: faFootballBall,
    route: '/playground',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    inProdVisible: false
  }
];
