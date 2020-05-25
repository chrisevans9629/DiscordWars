import { State } from '../UnitStates/State';
import { SpawnState } from '../UnitStates/SpawnState';
import { Level1 } from '../Levels/level1';
import { Base } from "../BaseStates/Base";
import { UnitState } from "./UnitState";
export class Unit extends Phaser.GameObjects.Container {
    currentBase: Base;
    spawning: boolean;
    unitImg: Phaser.Physics.Arcade.Image;
    unitState: UnitState;
    teamId: number;
    value: number;
    maxScale: number;
    constructor(scene: Level1, base: Base, teamid: number) {
        super(scene, base.x, base.y, []);
        this.teamId = teamid;
        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0, 0, 'base').setOrigin(0.5, 0.5);
        this.scale = 0.08;
        this.maxScale = 0.16;
        this.unitState = new SpawnState(this, scene);
        this.value = 1;
        //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
        this.spawning = true;
        this.add(this.unitImg);
        scene.sys.displayList.add(this);

    }

    


}
