import {WettkampfInfoDTO} from '@schusszettel/types/inside/wettkampf-info-dto';

export class TabletSessionSingDTO {
  teamId: number;
  teamName: string;
  status: string;
  token: string;
  currentPasse: number;
  naechsterGegnerName?: string;  // Made optional and consistent naming
  wettkampfInfo?: WettkampfInfoDTO;  // Add optional wettkampfInfo

  constructor(
    teamId: number,
    teamName: string,
    status: string,
    token: string,
    currentPasse: number,
    naechsterGegnerName?: string,
    wettkampfInfo?: WettkampfInfoDTO
  ) {
    this.teamId = teamId;
    this.teamName = teamName;
    this.status = status;
    this.token = token;
    this.currentPasse = currentPasse;
    this.naechsterGegnerName = naechsterGegnerName;
    this.wettkampfInfo = wettkampfInfo;
  }
}
