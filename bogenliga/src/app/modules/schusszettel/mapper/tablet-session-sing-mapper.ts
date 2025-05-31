import {TabletSessionSingDTO} from '../types/datatransfer/tablet-session-sing-dto.class';
import {TabletSessionSingDO} from '../types/tablet-session-sing-do.class';

export class TabletSessionSingMapper {
  static fromDTO(dto: TabletSessionSingDTO): TabletSessionSingDO {
    return new TabletSessionSingDO(
      dto.teamId,
      dto.teamName,
      dto.status,
      dto.token,
      dto.currentPasse,
      dto.naechsterGegnerName,  // Use consistent field name
      dto.wettkampfInfo
    );
  }

  static toDTO(doObj: TabletSessionSingDO): TabletSessionSingDTO {
    return new TabletSessionSingDTO(
      doObj.teamId,
      doObj.teamName,
      doObj.status,
      doObj.token,
      doObj.currentPasse,
      doObj.naechsterGegnerName,  // Use consistent field name
      doObj.wettkampfInfo
    );
  }
}
