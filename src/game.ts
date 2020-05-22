import * as Phaser from 'phaser';
import Level1 from './Levels/level1';
let config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    scene: [Level1],
    parent: 'game-parent',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    }
};

let game = new Phaser.Game(config);

function move(fromBase: number, toBase: number, count: number){
    let scene = game.scene.scenes[0] as Level1;
    scene.move(fromBase, toBase, count);
}

export { game, move };
