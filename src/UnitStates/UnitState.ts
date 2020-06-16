import { State } from './State';
import { Unit } from './Unit';
import { soundSystem, ILevel } from '../game';

export class UnitState extends State<Unit> {
    update(){
        let lvl = this.Scene as ILevel;

        this.Scene.physics.overlap(this.Unit.unitImg,lvl.units.map(p => p.unitImg),this.collission,null,this);
    }

    removing(newState: UnitState){

    }

    collission(img1: Phaser.Physics.Arcade.Image, img2: Phaser.Physics.Arcade.Image){
        let unit1 = img1.parentContainer as Unit;
        let unit2 = img2.parentContainer as Unit;
        let lvl = this.Scene;
        if(unit1.team.teamId != unit2.team.teamId){
            let u1val = unit1.value;
            unit1.value -= unit2.value;
            unit2.value -= u1val;
            if(unit1.value <= 0)
            {
                lvl.destroyUnit(unit1);
                lvl.particleEngine.explosion(unit1.x,unit1.y,10,0.05, 500, unit1.team.tint);
                soundSystem.playRandom(soundSystem.explosionSounds);
            }
            if(unit2.value <= 0){
                lvl.destroyUnit(unit2);
                lvl.particleEngine.explosion(unit2.x,unit2.y,10,0.05, 500, unit2.team.tint);
                soundSystem.playRandom(soundSystem.explosionSounds);
            }
            
        }
        else {
            if(lvl.fps <= 55){
                CombineUnits(unit1, unit2, lvl);
            }
        }
    }
}

export function CombineUnits(unit1: Unit, unit2: Unit, lvl: ILevel) {
    unit1.value += unit2.value;
    unit1.scale = unit1.maxScale;
    lvl.destroyUnit(unit2);
}
