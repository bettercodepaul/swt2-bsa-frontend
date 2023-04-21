import {CommonDialogConfig} from '../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {UserPermission} from '@shared/services';
export const HOME_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'HOME',
  pageTitleTranslationKey: 'HOME.HOME.TITLE',
};

export const HOME_SHORTCUT_BUTTON_CONFIG: ShortcutButtonsConfig = {
  shortcutButtons: [
    {
      title: 'test1',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_DSBMITGLIEDER]
    },
    {
      title: 'test2',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_CREATE_MANNSCHAFT]
    },
    {
      title: 'test3',
      icon: '',
      route: '#',
      permissions: [UserPermission.CAN_READ_STAMMDATEN]
    }
  ]
};
