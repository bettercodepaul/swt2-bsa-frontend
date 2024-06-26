import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in der de.json auslgelagert
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUEKENNUMMER',
      propertyName:   'rueckenNummer',
      width:          5,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          200,
    },
    {
      translationKey: 'WETTKAEMPFE.WETTKAEMPFE.WETTKAMPFTAGEINS',
      propertyName:   'wettkampftag1',
      width:          40
    },
    {
      translationKey: 'WETTKAEMPFE.WETTKAEMPFE.WETTKAMPFTAGZWEI',
      propertyName:   'wettkampftag2',
      width:          40
    },
    {
      translationKey: 'WETTKAEMPFE.WETTKAEMPFE.WETTKAMPFTAGDREI',
      propertyName:   'wettkampftag3',
      width:          40
    },
    {
      translationKey: 'WETTKAEMPFE.WETTKAEMPFE.WETTKAMPFTAGVIER',
      propertyName:   'wettkampftag4',
      width:          40
    },
    {
      translationKey: 'WETTKAEMPFE.WETTKAEMPFE.WETTKAMPFTAGESCHNITT',
      propertyName:   'wettkampftageSchnitt',
      width:          40,
    }
  ],
};
