import { State } from '../UnitStates/State';
import { SpawnState } from '../UnitStates/SpawnState';
import { Base } from "../BaseStates/Base";
import { IBase } from "../BaseStates/IBase.1";
import { UnitState } from "./UnitState";
import { ITeamSystem } from '../support/TeamSystem';
import { ILevel } from '../game';
import { IUnit } from './IUnit';

let id = 0;
export class Unit extends Phaser.GameObjects.Container implements IUnit {
    currentBase: IBase;
    unitImg: Phaser.Physics.Arcade.Image;
    private _unitState: UnitState;
    team: ITeamSystem;
    value: number;
    maxScale: number;
    unitId: number;
    //tint: number;
    get tint(){
        if(this.unitImg){
            return this.unitImg.tintTopLeft;
        }
        return 0;
    }
    set tint(value) {
        if(this.unitImg) {
            this.unitImg.tint = value;
        }
    }
    constructor(scene: ILevel, base: IBase, team: ITeamSystem, key: string) {
        super(scene.scene.scene, base.x, base.y, []);
        this.team = team;
        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0, 0, key).setOrigin(0.5, 0.5);
        this.scale = 0.08;
        this.maxScale = 0.16;
        this._unitState = new SpawnState(this, scene);
        this.value = 1;
        this.tint = this.team.tint;
        this.unitId = id;
        id++;
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
