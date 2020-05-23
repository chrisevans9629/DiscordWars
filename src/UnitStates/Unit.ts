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
    constructor(scene: Level1, base: Base, teamid: number) {
        super(scene, base.x, base.y, []);
        this.teamId = teamid;
        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0, 0, 'base').setOrigin(0.5, 0.5);
        this.unitImg.scale = 0.08;
        this.unitState = new SpawnState(this, scene);
        //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
        this.spawning = true;
        this.add(this.unitImg);
        scene.sys.displayList.add(this);

    }

    


}
