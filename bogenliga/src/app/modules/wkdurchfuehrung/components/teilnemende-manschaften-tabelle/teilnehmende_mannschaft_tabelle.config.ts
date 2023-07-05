import {CommonDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {UserPermission} from '@shared/services';


export const TEILNEHMENDE_MANNSCHAFT_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'Mannschaftsname',
      propertyName:   'name',
      width:          20,
    }
  ],
  actions: {
    localizationKeys: {actionColum: "Mitglied/Schütze hinzufügen"},
    actionTypes: [TableActionType.ADD],
    width:       6
  },
  deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN],
  editPermission: [UserPermission.CAN_MODIFY_MY_VEREIN]

};
