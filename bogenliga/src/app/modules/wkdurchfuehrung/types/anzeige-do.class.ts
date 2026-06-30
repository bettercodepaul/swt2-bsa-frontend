import {DataObject} from '@shared/data-provider';


export class AnzeigenDO implements DataObject {
  id: number;
  physischeBildschirmId: string;
  tableTyp: string;
  wettkampfId: number;
  aktuellesMatch: number;
}
