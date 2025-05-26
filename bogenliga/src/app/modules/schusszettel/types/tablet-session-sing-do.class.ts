export class TabletSessionSingDO {
  constructor(
    public teamId: number,
    public teamName: string,
    public status: string,
    public token: string,
    public currentPasse: number,
    public naechsterGegnerName?: string
  ) {}
}
