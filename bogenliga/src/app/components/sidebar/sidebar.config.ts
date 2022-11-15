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
  faUsers,
  faQuestion,

  faTrophy, //Wettkämpfe
  faCalendar, //Wettkampfdurchführung
  faCogs //Verwaltung

} from '@fortawesome/free-solid-svg-icons';


export const SIDE_BAR_CONFIG: SideBarNavigationItem[] = [
 /* {
    label: 'SIDEBAR.HOME',
    icon: faHome,
    route: '/home',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-home-button'
  },*/

  {
    label: 'SIDEBAR.REGIONEN',
    icon: faBullseye,
    route: '/regionen',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-regionen-button'
  },
  {
    label: 'SIDEBAR.VEREINE',
    icon: faUsers,
    route: '/vereine',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-vereine-button'
  },

  {
    label: 'SIDEBAR.WETTKAMPF',
    icon: faTrophy,
    route: '/wettkaempfe',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-wettkampf-button'
  },

  {
    label: 'SIDEBAR.WKDURCHFUEHRUNG',
    icon: faCalendar,
    route: '/wkdurchfuehrung',
    permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF],
    subitems: [],
    datacy: 'sidebar-wkdurchfuehrung-button'
  },


  {
    label: 'SIDEBAR.MANNSCHAFTEN',
    icon: faListOl,
    route: '/ligatabelle',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-ligatabelle-button'
  },
  {
    label: 'SIDEBAR.SPOTTING',
    icon: faBinoculars,
    route: '/spotter',
    permissons: [UserPermission.CAN_OPERATE_SPOTTING],
    subitems: [],
    datacy: 'sidebar-spotting-button'
  },

  {
    label: 'SIDEBAR.VERWALTUNG',
    icon: faCogs,
    route: '/verwaltung',
    permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
    datacy: 'sidebar-verwaltung-button',
    subitems: [
      {
        label: 'DSB Mitglieder',
        route: '/verwaltung/dsbmitglieder',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-mitglieder-button'
      },
      {
        label: 'Benutzer',
        route: '/verwaltung/benutzer',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy: 'sidebar-verwaltung-benutzer-button'
      },
      {
        label: 'Klassen',
        route: '/verwaltung/klassen',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy: 'sidebar-verwaltung-klassen-button'
      },
      {
        label: 'Vereine',
        route: '/verwaltung/vereine',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-vereine-button'
      },
      {
        label: 'Ligen',
        route: '/verwaltung/liga',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-ligen-button'
      },
      {
        label: 'Regionen',
        route: '/verwaltung/region',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-regionen-button'
      },
      {
        label: 'Veranstaltungen',
        route: '/verwaltung/veranstaltung',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-veranstaltungen-button'
      }
    ]
  },

  {
    label: 'SIDEBAR.PLAYGROUND',
    icon: faFootballBall,
    route: '/playground',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    inProdVisible: false,
    datacy: 'sidebar-playground-button'
  },
  {
    label: 'SIDEBAR.HILFE',
    icon: faQuestion,
    route: '/hilfe',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-hilfe-button'
  }
];
// sidebar for offlinemode
export const SIDE_BAR_CONFIG_OFFLINE: SideBarNavigationItem[] = [

  {
    label: 'SIDEBAR.HOME',
    icon: faHome,
    route: '/home',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-home-button'
  },


  {
    label: 'SIDEBAR.VERWALTUNG',
    icon: faArchive,
    route: '/verwaltung',
    permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
    datacy: 'sidebar-verwaltung-button',
    subitems: [
      {
        label: 'DSB Mitglieder',
        route: '/verwaltung/dsbmitglieder',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-mitglieder-button'
      },
      {
        label: 'Benutzer',
        route: '/verwaltung/benutzer',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy: 'sidebar-verwaltung-benutzer-button'
      },
      {
        label: 'Klassen',
        route: '/verwaltung/klassen',
        permissons: [UserPermission.CAN_READ_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN],
        datacy: 'sidebar-verwaltung-klassen-button'
      },
      {
        label: 'Vereine',
        route: '/verwaltung/vereine',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-vereine-button'
      },
      {
        label: 'Ligen',
        route: '/verwaltung/liga',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-ligen-button'
      },
      {
        label: 'Regionen',
        route: '/verwaltung/region',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-regionen-button'
      },
      {
        label: 'Veranstaltungen',
        route: '/verwaltung/veranstaltung',
        permissons: [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_STAMMDATEN],
        datacy: 'sidebar-verwaltung-veranstaltungen-button'
      }
    ]
  },
  {
    label: 'SIDEBAR.WETTKAMPF',
    icon: faSitemap,
    route: '/wettkaempfe',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-wettkampf-button'
  },
  {
    label: 'SIDEBAR.WKDURCHFUEHRUNG',
    icon: faCalendarAlt,
    route: '/wkdurchfuehrung',
    permissons: [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF],
    subitems: [],
    datacy: 'sidebar-wkdurchfuehrung-button'
  },
  {
    label: 'SIDEBAR.MANNSCHAFTEN',
    icon: faListOl,
    route: '/ligatabelle',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-ligatabelle-button'
  },
  {
    label: 'SIDEBAR.SPOTTING',
    icon: faBinoculars,
    route: '/spotter',
    permissons: [UserPermission.CAN_OPERATE_SPOTTING],
    subitems: [],
    datacy: 'sidebar-spotting-button'
  },
  {
    label: 'SIDEBAR.PLAYGROUND',
    icon: faFootballBall,
    route: '/playground',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    inProdVisible: false,
    datacy: 'sidebar-playground-button'
  },
  {
    label: 'SIDEBAR.HILFE',
    icon: faQuestion,
    route: '/hilfe',
    permissons: [UserPermission.CAN_READ_DEFAULT],
    subitems: [],
    datacy: 'sidebar-hilfe-button'
  }
];
