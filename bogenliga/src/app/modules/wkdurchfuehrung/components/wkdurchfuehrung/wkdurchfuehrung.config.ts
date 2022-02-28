import {NavigationDialogConfig} from '../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';


export const WKDURCHFUEHRUNG_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'WKDURCHFUEHRUNG',
  pageTitleTranslationKey: 'WKDURCHFUEHRUNG.WKDURCHFUEHRUNG.TITLE',
  navigationCardsConfig:   {
    navigationCards: []
  }
};



export const WETTKAMPF_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'WKDURCHFUEHRUNG.WETTKAMPF.TABLE.CDAY',
      propertyName:   'wettkampfTag',
      width:          20,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.WETTKAMPF.TABLE.DATE',
      propertyName:   'wettkampfDatum',
      width:          15,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.WETTKAMPF.TABLE.TIME',
      propertyName:   'wettkampfBeginn',
      width:          15,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.WETTKAMPF.TABLE.PLACE',
      propertyName:   'wettkampfOrtsname',
      width:          40,
    },
   ],

  actions: {
    actionTypes: [TableActionType.VIEW, TableActionType.MAP ],
    width:       6
  }
  };



export const MATCH_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.NUMMER',
      propertyName:   'nr',
      width:          5,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.SCHEIBE',
      propertyName:   'scheibenNummer',
      width:          5,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.MANNSCHAFT',
      propertyName:   'mannschaftName',
      width:          20,
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.BEGEGNUNG',
      propertyName:   'begegnung',
      width:          5
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.MATCHPUNKTE',
      propertyName:   'matchpunkte',
      type:            5,
      currentSortOrder: 1,
      width:           5
    },
    {
      translationKey: 'WKDURCHFUEHRUNG.MATCH.TABLE.SATZPUNKTE',
      propertyName:   'satzpunkte',
      width:          5,
    }
  ],
  actions: {
    actionTypes: [TableActionType.EDIT],
    width: 6
  }

};

