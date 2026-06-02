import {CommonDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {UserPermission} from '@shared/services';


export const VEREIN_DETAIL_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VEREIN_DETAIL.TITLE',


};
export const VEREIN_DETAIL_TABLE_CONFIG: TableConfig = {

    columns: [
      {
        translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.MANNSCHAFTSNAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.LIGA',
        propertyName:   'veranstaltungName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.SPORTJAHR',
        propertyName:   'sportjahr',
        width:          20,
      },
    ],
    coloredActionsWithText: true,
    actions: {
      actionTypes: [
        TableActionType.EDIT,
        TableActionType.DELETE,
        TableActionType.DOWNLOADLIZENZEN,
        TableActionType.DOWNLOADRUECKENNUMMER,
        TableActionType.ADD,
        TableActionType.DOWMLOADSCHUSZETTELTAG1,
        TableActionType.DOWMLOADSCHUSZETTELTAG2,
        TableActionType.DOWMLOADSCHUSZETTELTAG3,
        TableActionType.DOWMLOADSCHUSZETTELTAG4
      ],
      width:       15
    },
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN],
    editPermission: [UserPermission.CAN_MODIFY_MY_VEREIN, UserPermission.CAN_MODIFY_STAMMDATEN_LIGALEITER],
    addPermission: [UserPermission.CAN_MODIFY_MY_VEREIN, UserPermission.CAN_MODIFY_STAMMDATEN_LIGALEITER]

};
