import { State } from './State';
import { Unit } from './Unit';
import Level1 from '../Levels/level1';
export class UnitState extends State<Unit> {
    update(){
        let lvl = this.Scene as Level1;
        this.Scene.physics.overlap(this.Unit.unitImg,lvl.units.map(p => p.unitImg),this.collission,null,this);
    }
    collission(img1: Phaser.Physics.Arcade.Image, img2: Phaser.Physics.Arcade.Image){
        let unit1 = img1.parentContainer as Unit;
        let unit2 = img2.parentContainer as Unit;
        let lvl = this.Scene as Level1;
        if(unit1.teamId != unit2.teamId){
            
            lvl.destroyUnit(unit1);
            lvl.destroyUnit(unit2);
        }
        else {
            
        }
    }
}