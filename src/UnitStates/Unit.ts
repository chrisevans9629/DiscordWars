import { State } from '../UnitStates/State';
import { SpawnState } from '../UnitStates/SpawnState';
import { Level1 } from '../Levels/level1';
import { Base, IBase } from "../BaseStates/Base";
import { UnitState } from "./UnitState";
import { ITeamSystem } from '../support/TeamSystem';

export interface IUnit {  
    value: number;
    team: ITeamSystem;
    unitState: UnitState;
    currentBase: IBase;
    tint: number;
    maxScale: number;
}

export class Unit extends Phaser.GameObjects.Container implements IUnit {
    currentBase: IBase;
    unitImg: Phaser.Physics.Arcade.Image;
    private _unitState: UnitState;
    team: ITeamSystem;
    value: number;
    maxScale: number;
    tint: number;
    constructor(scene: Level1, base: IBase, team: ITeamSystem, key: string) {
        super(scene, base.x, base.y, []);
        this.team = team;
        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0, 0, key).setOrigin(0.5, 0.5);
        this.scale = 0.08;
        this.maxScale = 0.16;
        this._unitState = new SpawnState(this, scene);
        this.value = 1;
        //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
        this.add(this.unitImg);
        scene.sys.displayList.add(this);

    }
    get unitState() {
        return this._unitState;
    }
    
    set unitState(state: UnitState){
        this._unitState.removing(state);
        this._unitState = state;
    }


}
