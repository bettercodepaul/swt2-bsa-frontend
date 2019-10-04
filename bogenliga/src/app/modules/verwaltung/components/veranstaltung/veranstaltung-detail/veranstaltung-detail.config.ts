import {CommonDialogConfig} from '../../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';

export const VERANSTALTUNG_DETAIL_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VERANSTALTUNG_DETAIL.TITLE'
};

export const VERANSTALTUNG_DETAIL_TABLE_Config: TableConfig = {
  columns: [
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.MANNSCHAFTNAME',
      propertyName:   'name',
      width:          20,
    },
    {
      translationKey: 'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.SORTIERUNG',
      propertyName:   'sortierung',
      width:          20,
    }
  ],
  actions: {
    actionTypes: [TableActionType.EDIT],
    width:       6
  }
};
