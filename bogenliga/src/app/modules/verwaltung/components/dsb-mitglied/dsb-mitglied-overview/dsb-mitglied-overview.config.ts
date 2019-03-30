import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const DSB_MITGLIED_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.DSBMITGLIEDER.TITLE',

  tableConfig: {
    columns: [

      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.VORNAME',
        propertyName:   'vorname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.NACHNAME',
        propertyName:   'nachname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.GEBURTSDATUM',
        propertyName:   'geburtsdatum',
        type:           TableColumnType.DATE,
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.MITGLIEDSNUMMER',
        propertyName:   'mitgliedsnummer',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
