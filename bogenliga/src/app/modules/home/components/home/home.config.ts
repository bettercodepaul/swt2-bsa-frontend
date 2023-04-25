import {CommonDialogConfig} from '../../../shared/components/dialogs';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {UserPermission} from '@shared/services';
// @ts-ignore
import AddManschaftsmitglied from '../home/Buttons/AddManschaftsmitglied.svg';

export const HOME_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'HOME',
  pageTitleTranslationKey: 'HOME.HOME.TITLE',
};

export const HOME_SHORTCUT_BUTTON_CONFIG: ShortcutButtonsConfig = {
  shortcutButtons: [
    {
      title: 'Manschaftsmitglied hinzufügen',
      icon: AddManschaftsmitglied,
      route: '',
      permissions: [UserPermission.CAN_MODIFY_MANNSCHAFT, UserPermission.CAN_MODIFY_MY_VEREIN]
    },
    {
      title: 'Terminübersicht',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_WETTKAMPF]
    },
    {
      title: 'Veranstaltungen',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN]
    },
    {
      title: 'Mannschaften anlegen',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_CREATE_MANNSCHAFT, UserPermission.CAN_MODIFY_STAMMDATEN]
    },
    {
      title: 'Veranstaltung anlegen',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN]
    },
    {
      title: 'Wettkampf- durchführung',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN]
    },
  ]
};
