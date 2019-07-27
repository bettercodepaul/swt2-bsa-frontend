import {NavigationDialogConfig} from '@shared/components';
import {TableActionType} from "@shared/components/tables/types/table-action-type.enum";
import {OverviewDialogConfig} from '@shared/components/dialogs';

export const LIGATABELLE_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey: 'LIGATABELLE',
  pageTitleTranslationKey: 'MANNSCHAFTEN.LIGATABELLE.TITLE',
  navigationCardsConfig: {
    navigationCards: []
  }
};


export const LIGA_TABELLE_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'LIGATABELLE',
  pageTitleTranslationKey: 'MANNSCHAFTEN.LIGATABELLE.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANNSCHAFTEN.LIGATABELLE.TABLE.COLUMNS.PLATZ',
        propertyName:   'ligatabellePlatz',
        width:          20,
      },
      {
        translationKey: 'MANNSCHAFTEN.LIGATABELLE.TABLE.COLUMNS.VEREIN',
        propertyName:   'ligatabelleVerein',
        width:          5,
      },
      {
        translationKey: 'MANNSCHAFTEN.LIGATABELLE.TABLE.COLUMNS.MANNSCHAFT',
        propertyName:   'ligatabelleMannschaft',
        width:          5,
      },
      {
        translationKey: 'MANNSCHAFTEN.LIGATABELLE.TABLE.COLUMNS.SATZPUNKTE',
        propertyName:   'liagtabelleSatzpunkte',
        width:          5,
      },
      {
        translationKey: 'MANNSCHAFTEN.LIGATABELLE.TABLE.COLUMNS.MATCHPUNKTE',
        propertyName:   'liagtabelleMatchpunkte',
        width:          5,
      }
    ],
    actions: {
    actionTypes: [TableActionType.ADD, TableActionType.DELETE, TableActionType.DOWNLOAD, TableActionType.VIEW],
      width:       6
  }
}


};
