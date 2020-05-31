import { State } from '../UnitStates/State';
import { Unit } from '../UnitStates/Unit';
import { Base } from "./Base";
import Level1 from '../Levels/level1';

export interface UnitChange {
    valueUsed: number;
}

export class BaseState extends State<Base> {
    secondPassed() {
    }
    unitHit(unit: Unit) {
        let lvl = this.Scene as Level1;
        let y = Phaser.Math.FloatBetween(-1,1) * 30;
        let x = Phaser.Math.FloatBetween(-1,1) * 30;
        lvl.particleEngine.explosion(this.Unit.x + x, this.Unit.y + y, 3, 0.25, 4000);
        lvl.hitSounds[Math.floor(Math.random() * lvl.hitSounds.length)].play({ volume: lvl.masterVolume * lvl.soundVolume });
        return { valueUsed: 0 };
    }
}
