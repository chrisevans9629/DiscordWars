import { State } from '../UnitStates/State';
import { Level1 } from '../Levels/level1';
import { ILevel } from '../game';
export class GameState extends State<ILevel> {
    constructor(scene: ILevel) {
        super(scene, scene);
    }
}
