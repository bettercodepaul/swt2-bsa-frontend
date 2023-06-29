import {CommonDialogConfig} from '../../../shared/components/dialogs';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {UserPermission} from '@shared/services';
// @ts-ignore
import AddManschaftsmitglied from '../home/Buttons/AddManschaftsmitglied.svg';
// @ts-ignore
import DSBMitgliedAnlegen from '../home/Buttons/DSBMitgliedAnlegen.svg';
// @ts-ignore
import ManschaftAnlegen from '../home/Buttons/ManschaftAnlegen.svg';
// @ts-ignore
import Terminübersicht from '../home/Buttons/Terminübersicht.svg';
// @ts-ignore
import VeranstaltungAnlegen from '../home/Buttons/VeranstaltungAnlegen.svg';
// @ts-ignore
import VorauswahlVeranstaltung from '../home/Buttons/VorauswahlVeranstaltung.svg';
// @ts-ignore
import VereinsmitgliederVerwalten from '../home/Buttons/VereinsmitgliederVerwalten.svg';


export const HOME_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'HOME',
  pageTitleTranslationKey: 'HOME.HOME.TITLE',
};

export const HOME_SHORTCUT_BUTTON_CONFIG: ShortcutButtonsConfig = {
  shortcutButtons: [
    {
      title: 'Vorauswahl Veranstaltungen',
      icon: VorauswahlVeranstaltung,
      route: '/verwaltung/veranstaltung',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles: ["AUSRICHTER"]
    },
    {
      title: 'Veranstaltung anlegen',
      icon: VeranstaltungAnlegen,
      route: '/verwaltung/veranstaltung/add',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles: ["LIGALEITER"]
    },
    {
      title: 'Mannschaftsmitglied hinzufügen',
      icon: AddManschaftsmitglied,
      route: '/verwaltung/vereine/vereinsid',
      permissions: [UserPermission.CAN_MODIFY_MANNSCHAFT, UserPermission.CAN_MODIFY_MY_VEREIN],
      roles: ["SPORTLEITER"]
    },
    {
      title: 'Vereinsmitglied anlegen',
      icon: DSBMitgliedAnlegen,
      route: '/verwaltung/dsbmitglieder/add',
      permissions: [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER],
      roles:["SPORTLEITER"]
    },
    {
      title: 'Vereinsmitglieder verwalten',
      icon: VereinsmitgliederVerwalten,
      route: '/verwaltung/dsbmitglieder',
      permissions: [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER],
      roles:["SPORTLEITER"]
    },
    {
      title: 'Wettkampf- durchführung',
      icon: Terminübersicht,
      route: '/wkdurchfuehrung',
      permissions: [UserPermission.CAN_READ_WETTKAMPF],
      roles: ["KAMPFRICHTER","LIGALEITER","AUSRICHTER"]
    },
    {
      title: 'Vereinsübersicht',
      icon: ManschaftAnlegen,
      route: '/verwaltung/vereine',
      permissions: [UserPermission.CAN_CREATE_MANNSCHAFT, UserPermission.CAN_MODIFY_STAMMDATEN],
      roles:["LIGALEITER"]
    }
  ]
};
