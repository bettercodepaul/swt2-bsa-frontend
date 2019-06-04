import {CommonDialogConfig, OverviewDialogConfig} from '../../../../../../shared/components/dialogs';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const SCHUETZEN_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.TITLE'
}


export const SCHUETZE_TABLE_CONFIG: TableConfig = {
    columns: [
      {
        translationKey: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.TABLE.HEADERS.MITGLIED_VORNAME',
        propertyName:   'vorname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.TABLE.HEADERS.MITGLIED_NACHNAME',
        propertyName:   'nachname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.TABLE.HEADERS.MITGLIED_NUMMER',
        propertyName:   'mitgliedsnummer',
        width:          20,
      }
      /*
      ,
      {
        translationKey: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.TABLE.HEADERS.MITGLIED_VEREIN',
        propertyName:   'vereinsId',
        width:          20,
      }*/
    ],
    actions: {
      actionTypes: [TableActionType.ADD],
      width:       6
    },
  };
