
function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}


export interface ITeamSystem {
    UnitImgKey: string;
    BaseImgKey: string;
    teamId: number;
    color: [number,number,number];
    tint: number;
}

        // this.teamBaseImgs.push({teamId: 1, BaseImgKey: 'red', UnitImgKey: 'red', color: [0xFF,0,0]});
        // this.teamBaseImgs.push({teamId: 2, BaseImgKey: 'blue', UnitImgKey: 'blue', color: [0,0,0xFF]});
        // this.teamBaseImgs.push({teamId: -1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0xFF,0xFF]});


export let teams: ITeamSystem[] = [
    {teamId: 1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0,0], tint: 0xFF0000},
    {teamId: 2, BaseImgKey: 'base', UnitImgKey: 'base', color: [0,0,0xFF], tint: 0x0000FF},
    {teamId: -1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0xFF,0xFF], tint: 0xFFFFFF},
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