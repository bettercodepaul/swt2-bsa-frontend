import {TabletSessionDTO} from '../types/datatransfer/tablet-session-dto.class';
import {TabletSessionDO} from '../types/tablet-session-do.class';


export class TabletSessionMapper {
  static tabletSessionToDO(payload: TabletSessionDTO): TabletSessionDO {
    return new TabletSessionDO(
      payload.scheibennummer,
      payload.wettkampfId,
      payload.active,
      payload.satznummer,
      payload.matchId,
      payload.otherMatchId,
      payload.accessToken,
    );
  }

  static tabletSessionToDTO(payload: TabletSessionDO): TabletSessionDTO {
    return new TabletSessionDTO(
      payload.scheibenNr,
      payload.wettkampfID,
      payload.isActive,
      payload.satzNr,
      payload.matchID,
      payload.otherMatchId,
      payload.accessToken
    );
  }
}
