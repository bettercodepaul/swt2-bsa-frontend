import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';

export const SPORTJAHR_LIGA_AUSWAHL_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.SPORTJAHR.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.LIGANAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.REGIONNAME',
        propertyName:   'regionName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.UEBERGEORDNETNAME',
        propertyName:   'ligaUebergeordnetName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.VERANTWORTLICHMAIL',
        propertyName:   'ligaVerantwortlichMail',
        width:            7
      }
    ]
  }
};
