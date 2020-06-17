import { State } from '../UnitStates/State';
import { Unit } from '../UnitStates/Unit';
import { IUnit } from "../UnitStates/IUnit";
import { Base } from "./Base";
import { IBase } from "./IBase.1";
import { soundSystem } from '../game';
import { IUnitChange } from './IUnitChange';

export class BaseState extends State<IBase> {
    secondPassed() {
    }
    unitHit(unit: IUnit) : IUnitChange {
        return { valueUsed: 0, shouldDestroy: false };
    }

    damageEffect(){
        let lvl = this.Scene;
        let y = Phaser.Math.FloatBetween(-1,1) * 30;
        let x = Phaser.Math.FloatBetween(-1,1) * 30;
        lvl.particleEngine.explosion(this.Unit.x + x, this.Unit.y + y, 3, 0.25, 4000, this.Unit.team.tint);
        soundSystem.playRandom(soundSystem.hitSounds);
    }
}
