



export function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
    let hex = componentToHex(r) + componentToHex(g) + componentToHex(b);
    //console.log(hex);
    return parseInt(hex, 16);
}

export interface tweenConfig {
    from: number,
    to: number,
    percent: number,
}

export function tween(p: tweenConfig) {
    let from = p.from;//Math.min(p.from, p.to);
    let to = p.to;//Math.max(p.from,p.to);
    let range = to - from;
    let avg = from + range * p.percent;
    return avg;
}

export interface ITeamSystem {
    UnitImgKey: string;
    BaseImgKey: string;
    teamId: number;
    color: [number, number, number];
    tint: number;
    names: string[];
}

// this.teamBaseImgs.push({teamId: 1, BaseImgKey: 'red', UnitImgKey: 'red', color: [0xFF,0,0]});
// this.teamBaseImgs.push({teamId: 2, BaseImgKey: 'blue', UnitImgKey: 'blue', color: [0,0,0xFF]});
// this.teamBaseImgs.push({teamId: -1, BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF,0xFF,0xFF]});


export let teams: ITeamSystem[] = [
    { teamId: 1, names: ['red','r'], BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF, 0, 0], tint: 0xFF0000 },
    { teamId: 2, names: ['blue','b'], BaseImgKey: 'base', UnitImgKey: 'base', color: [0, 0, 0xFF], tint: 0x0000FF },
    { teamId: 3, names: ['green', 'g'], BaseImgKey: 'base', UnitImgKey: 'base', color: [0, 0xFF, 0], tint: 0x00FF00 },
    { teamId: 4, names: ['yellow', 'y'], BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF, 0XFF, 0], tint: 0xFFFF00 },
    { teamId: -1, names: ['neutral'], BaseImgKey: 'base', UnitImgKey: 'base', color: [0xFF, 0xFF, 0xFF], tint: 0xFFFFFF },
];

export function getTeam(teamId: string) {
    return teams.find(p => p.teamId == Number(teamId) || p.names.some(r => r == teamId.toLocaleLowerCase()));
}
export function getColor(teamId: number) {
    let t = getTeam(teamId.toString()).color;
    //console.log(t);
    return `rgb(${t[0]},${t[1]},${t[2]})`;
}
export interface Style {
    color: string;
}

export interface IPlayer {
    name: string;
    team: ITeamSystem;
    style: Style;
    avatarUrl: string;
}

export class AIPlayer implements IPlayer {
    name = 'AI'
    team: ITeamSystem;
    style: Style;
    avatarUrl:string = null;
    constructor(tm: number){
        let team = getTeam(tm.toString());
        this.team = team;
        this.style = {color: getColor(tm)};
    }
}

export interface Chat {
    name: string;
    message: string;
    player: IPlayer;
}
let c: Chat[] = [];
let p: IPlayer[] = [];

interface IRender {
    render(): void;
}

export interface ITeamInteractor {
    players: IPlayer[]
    chat: Chat[]
    addChat(c: Chat): void;
}


class TeamInteractor implements ITeamInteractor {
    private _chat: Chat[]
    private _players: IPlayer[]
    get chat() {
        return this._chat;
    }
    get players() {
        return this._players;
    }
    renderer: IRender;
    constructor() {
        this._chat = [];
        this._players = [];
    }
    addChat(c: Chat) {
        this._chat.push(c);
        if (this.renderer) {
            this.renderer.render();
        }
    }
    addPlayer(p: IPlayer) {
        this._players.push(p);
        if (this.renderer) {
            this.renderer.render();
        }
    }
    removePlayer(userName: string) {
        this._players = this._players.filter(p => p.name != userName);
        if (this.renderer) {
            this.renderer.render();
        }
    }
}

export let TeamInteraction = new TeamInteractor();


// export class TeamSystem implements ITeamSystem {
//     UnitImgKey: string;
//     BaseImgKey: string;
//     teamId: number;
//     color: number;
// }