import {NavigationDialogConfig} from '../../../shared/components/dialogs';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';


export const SPORTJAHRESPLAN_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey:    'SPORTJAHRESPLAN',
  pageTitleTranslationKey: 'SPORTJAHRESPLAN.SPORTJAHRESPLAN.TITLE',
  navigationCardsConfig:   {
    navigationCards: []
  }
};



export const WETTKAMPF_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'SPORTJAHRESPLAN.WETTKAMPF.TABLE.CDAY',
      propertyName:   'wettkampfTag',
      width:          20,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.WETTKAMPF.TABLE.DATE',
      propertyName:   'wettkampfDatum',
      width:          15,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.WETTKAMPF.TABLE.TIME',
      propertyName:   'wettkampfBeginn',
      width:          15,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.WETTKAMPF.TABLE.PLACE',
      propertyName:   'wettkampfOrt',
      width:          40,
    },
   ],

  actions: {
    actionTypes: [TableActionType.DOWNLOAD, TableActionType.VIEW],
    width:       6
  }
  };



export const MATCH_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.NUMMER',
      propertyName:   'nr',
      width:          5,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.SCHEIBE',
      propertyName:   'scheibenNummer',
      width:          5,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.MANNSCHAFT',
      propertyName:   'mannschaftName',
      width:          20,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.BEGEGNUNG',
      propertyName:   'begegnung',
      width:          5,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.MATCHPUNKTE',
      propertyName:   'matchpunkte',
      width:          5,
    },
    {
      translationKey: 'SPORTJAHRESPLAN.MATCH.TABLE.SATZPUNKTE',
      propertyName:   'satzpunkte',
      width:          5,
    }
  ],
  actions: {
    actionTypes: [TableActionType.EDIT],
    width: 6
  }

};

