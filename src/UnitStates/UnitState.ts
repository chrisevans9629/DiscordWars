import { State } from './State';
import { Unit } from './Unit';
import Level1 from '../Levels/level1';

export class UnitState extends State<Unit> {
    update(){
        let lvl = this.Scene as Level1;

        this.Scene.physics.overlap(this.Unit.unitImg,lvl.units.map(p => p.unitImg),this.collission,null,this);
    }

    removing(newState: UnitState){

    }

    collission(img1: Phaser.Physics.Arcade.Image, img2: Phaser.Physics.Arcade.Image){
        let unit1 = img1.parentContainer as Unit;
        let unit2 = img2.parentContainer as Unit;
        let lvl = this.Scene as Level1;
        if(unit1.team.teamId != unit2.team.teamId){
            let u1val = unit1.value;
            unit1.value -= unit2.value;
            unit2.value -= u1val;
            if(unit1.value <= 0)
            {
                lvl.destroyUnit(unit1);
                lvl.particleEngine.explosion(unit1.x,unit1.y,10,0.05, 500);
                // let m = lvl.explosionSounds[Math.floor(Math.random() * lvl.explosionSounds.length)];
                // m.play({ volume: lvl.masterVolume * lvl.soundVolume });
                lvl.SoundSystem.playRandom(lvl.SoundSystem.explosionSounds);
            }
            if(unit2.value <= 0){
                lvl.destroyUnit(unit2);
                lvl.particleEngine.explosion(unit2.x,unit2.y,10,0.05, 500);
                // let m = lvl.explosionSounds[Math.floor(Math.random() * lvl.explosionSounds.length)];
                // m.play({ volume: lvl.masterVolume * lvl.soundVolume });
                lvl.SoundSystem.playRandom(lvl.SoundSystem.explosionSounds);
            }
            
        }
        else {
            if(lvl.fps <= 55){
                unit1.value += unit2.value;
                unit1.scale = unit1.maxScale;
                lvl.destroyUnit(unit2);
            }
        }
    }
}