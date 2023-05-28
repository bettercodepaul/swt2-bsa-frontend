import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungOfflineSyncDto implements DataTransferObject {
  id: number;
  version: number;

  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterId: number;
  ligaId: number;
  phase: string;
  groesse: number;

  static copyFrom(optional: {
    id?: number,
    version?: number

    wettkampfTypId?: number,
    name?: string,
    sportjahr?: number,
    meldeDeadline?: string,
    ligaleiterId?: number,
    ligaId?: number,
    phase?: string,
    groesse?: number

  } = {}): VeranstaltungOfflineSyncDto {
    const copy = new VeranstaltungOfflineSyncDto();

    // show '0' value
    copy.id = optional.id >= 0 ? optional.id : null;

    copy.wettkampfTypId = optional.wettkampfTypId >= 0 ? optional.wettkampfTypId : null;

    copy.ligaleiterId = optional.ligaleiterId >= 0 ? optional.ligaleiterId : null;
    copy.sportjahr = optional.sportjahr >= 0 ? optional.sportjahr : null;
    copy.ligaId = optional.ligaId >= 0 ? optional.ligaId : null;
    copy.version = optional.version >= 0 ? optional.version : null;
    copy.name = optional.name || '';
    copy.meldeDeadline = optional.meldeDeadline || '';
    copy.phase = optional.phase || '';
    copy.groesse = optional.groesse >= 0 ? optional.groesse : null;


    return copy;
  }
}
