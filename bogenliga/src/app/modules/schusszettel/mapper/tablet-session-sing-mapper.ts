import { TabletSessionSingDTO } from '../types/datatransfer/tablet-session-sing-dto.class';
import { TabletSessionSingDO } from '../types/tablet-session-sing-do.class';

export class TabletSessionSingMapper {
  static fromDTO(dto: TabletSessionSingDTO): TabletSessionSingDO {
    return new TabletSessionSingDO(
      dto.teamId,
      dto.teamName,
      dto.status,
      dto.token,
      dto.currentPasse,
      dto.naechsterGegnerName
    );
  }

  static toDTO(doObj: TabletSessionSingDO): TabletSessionSingDTO {
    return {
      teamId: doObj.teamId,
      teamName: doObj.teamName,
      status: doObj.status,
      token: doObj.token,
      currentPasse: doObj.currentPasse,
      naechsterGegnerName: doObj.naechsterGegnerName
    };
  }
}
