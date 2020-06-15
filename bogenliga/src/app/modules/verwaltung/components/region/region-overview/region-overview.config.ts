import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const REGION_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.REGIONEN.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.NAME',
        propertyName:   'regionName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.CONTRACTION',
        propertyName:   'regionKuerzel',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.REGION_TYP',
        propertyName:   'regionTyp',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.REGION_SUPERORDINATE',
        propertyName:   'regionUebergeordnetAsName',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission :[UserPermission.CAN_MODIFY_STAMMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN]
  },
  //TODO exchange modify for create
  createPermission :[UserPermission.CAN_MODIFY_STAMMDATEN]
};
