import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'TABLE.DATE',
      propertyName:   'wettkampfTag',
      width:          20,
    },
    {
      translationKey: 'TABLE.TIME',
      propertyName:   'wettkampfUhrzeit',
      width:          20,
    },
    {
      translationKey: 'TABLE.LIGA',
      propertyName:   'wettkampfLiga',
      width:          20,
    },
    {
      translationKey: 'TABLE.PLACE',
      propertyName:   'wettkampfOrt',
      width:          20,
    }
  ],

};
