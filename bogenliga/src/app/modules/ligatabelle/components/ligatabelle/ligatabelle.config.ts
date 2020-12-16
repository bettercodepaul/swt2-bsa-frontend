import {NavigationDialogConfig} from '../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAEMPFE_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'WETTKAEMPFE',
  pageTitleTranslationKey: 'WETTKAEMPFE.WETTKAEMPFE.TITLE',
  navigationCardsConfig:   {
    navigationCards: []
  }
};

// the Ligatabelle is not sortable
export const LIGATABELLE_TABLE_CONFIG: TableConfig = {

  columns: [
     {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.TABELLENPLATZ',
      propertyName:   'tabellenplatz',
      width:           15,
      sortable:        false,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.MANNSCHAFTNAME',
      propertyName:   'mannschaft_name',
      width:           70,
      sortable:        false,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.MATCHPUNKTE',
      propertyName:   'matchpunkte',
      width:           15,
      sortable:        false,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.SATZPUNKTE',
      propertyName:   'satzpunkte',
      width:           15,
      sortable:        false,
    },
    {
      translationKey: 'WETTKAEMPFE.LIGATABELLE.SATZPUNKTDIFFERENZ',
      propertyName:   'satzpkt_differenz',
      width:           15,
      sortable:        false,
    }
  ]

};

