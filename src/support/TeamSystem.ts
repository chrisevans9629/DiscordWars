
export interface ITeamSystem {
    UnitImgKey: string;
    BaseImgKey: string;
    teamId: number;
    color: [number,number,number];
}

        // this.teamBaseImgs.push({teamId: 1, BaseImgKey: 'red', UnitImgKey: 'red', color: [0xFF,0,0]});
        // this.teamBaseImgs.push({teamId: 2, BaseImgKey: 'blue', UnitImgKey: 'blue', color: [0,0,0xFF]});
        // this.teamBaseImgs.push({teamId: -1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0xFF,0xFF]});


export let teams: ITeamSystem[] = [
    {teamId: 1, BaseImgKey: 'red', UnitImgKey: 'red', color: [0xFF,0,0]},
    {teamId: 2, BaseImgKey: 'blue', UnitImgKey: 'blue', color: [0,0,0xFF]},
    {teamId: -1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0xFF,0xFF]},
];

export function getTeam(teamId: number){
    return teams.find(p => p.teamId == teamId);
}

// export class TeamSystem implements ITeamSystem {
//     UnitImgKey: string;
//     BaseImgKey: string;
//     teamId: number;
//     color: number;
// }