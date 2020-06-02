export interface ITeamSystem {
    UnitImgKey: string;
    BaseImgKey: string;
    teamId: number;
    color: number;
}

export class TeamSystem implements ITeamSystem {
    UnitImgKey: string;
    BaseImgKey: string;
    teamId: number;
    color: number;
}