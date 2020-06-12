import { State } from '../UnitStates/State';
import { Level1 } from '../Levels/level1';
export class GameState extends State<Level1> {
    constructor(scene: Level1) {
        super(scene, scene);
    }
}
