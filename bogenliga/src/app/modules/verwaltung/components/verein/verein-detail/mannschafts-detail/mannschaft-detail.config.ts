import {CommonDialogConfig} from '../../../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';


export const MANNSCHAFT_DETAIL_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.MANNSCHAFT_DETAIL.TITLE'
};

export const MANNSCHAFT_DETAIL_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'MANAGEMENT.MANNSCHAFT_DETAIL.TABLE.HEADERS.MITGLIED_VORNAME',
      propertyName:   'vorname',
      width:          20,
    },
    {
      translationKey: 'MANAGEMENT.MANNSCHAFT_DETAIL.TABLE.HEADERS.MITGLIED_NACHNAME',
      propertyName:   'nachname',
      width:          20,
    },
    {
      translationKey: 'MANAGEMENT.MANNSCHAFT_DETAIL.TABLE.HEADERS.MITGLIED_NATIONALITAET',
      propertyName:   'nationalitaet',
      width:          20,
    },
    {
      translationKey: 'MANAGEMENT.MANNSCHAFT_DETAIL.TABLE.HEADERS.MITGLIED_NUMMER',
      propertyName:   'mitgliedsnummer',
      width:          20,
    },
  ],
  actions: {
    actionTypes: [TableActionType.DELETE, TableActionType.DOWNLOAD],
    width:       6
  },


};
