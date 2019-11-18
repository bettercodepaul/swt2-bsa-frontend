import {NavigationDialogConfig} from '../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAEMPFE_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'WETTKAEMPFE',
  pageTitleTranslationKey: 'WETTKAEMPFE.WETTKAEMPFE.TITLE',
  navigationCardsConfig:   {
    navigationCards: []
  }
};


export const LIGATABELLE_TABLE_CONFIG: TableConfig = {

  columns: [
     {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.TABELLENPLATZ',
      propertyName:   'tabellenplatz',
      width:          15,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.MANNSCHAFTNAME',
      propertyName:   'mannschaft_name',
      width:          70,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.MATCHPUNKTE',
      propertyName:   'matchpunkte',
      width:          15,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.SATZPUNKTE',
      propertyName:   'satzpunkte',
      width:          15,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.SATZPUNKTDIFFERENZ',
      propertyName:   'satzpkt_differenz',
      width:          15,
    }
  ]

};

