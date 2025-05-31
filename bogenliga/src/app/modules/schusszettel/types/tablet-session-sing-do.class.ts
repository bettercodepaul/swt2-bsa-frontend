import {WettkampfInfoDTO} from '@schusszettel/types/inside/wettkampf-info-dto';

export class TabletSessionSingDO {
  constructor(
    public teamId: number,
    public teamName: string,
    public status: string,
    public token: string,
    public currentPasse: number,
    public naechsterGegnerName?: string,  // Made optional and consistent naming
    public wettkampfInfo?: WettkampfInfoDTO  // Add optional wettkampfInfo
  ) {}
}
