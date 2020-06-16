import { State } from '../UnitStates/State';
import { Unit, IUnit } from '../UnitStates/Unit';
import { Base, IBase } from "./Base";
import { soundSystem } from '../game';

export interface UnitChange {
    valueUsed: number;
    shouldDestroy: boolean;
}

export class BaseState extends State<IBase> {
    secondPassed() {
    }
    unitHit(unit: IUnit) : UnitChange {
        let lvl = this.Scene;
        let y = Phaser.Math.FloatBetween(-1,1) * 30;
        let x = Phaser.Math.FloatBetween(-1,1) * 30;
        lvl.particleEngine.explosion(this.Unit.x + x, this.Unit.y + y, 3, 0.25, 4000, this.Unit.team.tint);
        soundSystem.playRandom(soundSystem.hitSounds);
        //lvl.hitSounds[Math.floor(Math.random() * lvl.hitSounds.length)].play({ volume: lvl.masterVolume * lvl.soundVolume });
        return { valueUsed: 0, shouldDestroy: false };
    }
}
