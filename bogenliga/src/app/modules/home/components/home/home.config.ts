import {CommonDialogConfig} from '../../../shared/components/dialogs';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {CurrentUserService, UserPermission} from '@shared/services';
import {UserRoleEnum} from '@shared/services/current-user/types/user-role.enum';
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

export const HOME_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'HOME',
  pageTitleTranslationKey: 'HOME.HOME.TITLE',
};

let vereinsID;

export const ID = (vID : number) => {
  this.vereinsID = vID;
}

// @ts-ignore
export const HOME_SHORTCUT_BUTTON_CONFIG: ShortcutButtonsConfig = {
  shortcutButtons: [
    {
      title: 'Vorauswahl Veranstaltungen',
      icon: VorauswahlVeranstaltung,
      route: '/verwaltung/veranstaltung',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles: [UserRoleEnum.AUSRICHTER_ROLE_ID]
    },
    {
      title: 'Veranstaltung anlegen',
      icon: VeranstaltungAnlegen,
      route: '/verwaltung/veranstaltung/add',
      permissions: [UserPermission.CAN_READ_STAMMDATEN],
      roles: [UserRoleEnum.LIGALEITER_ROLE_ID]
    },
    {
      title: 'Mannschaftsmitglied hinzufügen',
      icon: AddManschaftsmitglied,
      route: `/verwaltung/vereine/${vereinsID}`,
      permissions: [UserPermission.CAN_MODIFY_MANNSCHAFT, UserPermission.CAN_MODIFY_MY_VEREIN],
      roles: [ UserRoleEnum.SPORTLEITER_ROLE_ID]
    },
    {
      title: 'DSB-Mitglied Anlegen',
      icon: DSBMitgliedAnlegen,
      route: '/verwaltung/dsbmitglieder/add',
      permissions: [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER],
      roles:[UserRoleEnum.SPORTLEITER_ROLE_ID]
    },
    {
      title: 'Terminübersicht',
      icon: Terminübersicht,
      route: '/wkdurchfuehrung',
      permissions: [UserPermission.CAN_READ_WETTKAMPF],
      roles: [ /*UserRoleEnum.KAMPFRICHTER_ROLE_ID,*/ UserRoleEnum.LIGALEITER_ROLE_ID, UserRoleEnum.AUSRICHTER_ROLE_ID]
    },
    {
      title: 'Vereinsübersicht',
      icon: ManschaftAnlegen,
      route: '/verwaltung/vereine',
      permissions: [UserPermission.CAN_CREATE_MANNSCHAFT, UserPermission.CAN_MODIFY_STAMMDATEN],
      roles:[ UserRoleEnum.LIGALEITER_ROLE_ID]
    },
  ]
};

