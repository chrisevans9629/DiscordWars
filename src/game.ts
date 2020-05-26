import * as Phaser from 'phaser';
import Level1 from './Levels/level1';

import {MainMenu} from './Levels/mainmenu';
import { Player } from './vuemodel';

let config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    //scene: [Level1],
    parent: 'game-parent',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
};

let game = new Phaser.Game(config);

let menu = new MainMenu();

let level1 = new Level1();

game.scene.add('MainMenu', menu);
game.scene.add('level1', level1);

game.scene.start('level1');

function move(fromBase: number, toBase: number, count: number, user: Player){
    let scene = level1;
    scene.move(fromBase, toBase, count, user);
}

function retreat(toBase: number, user: Player){
    let scene = level1;
    scene.retreat(toBase, user);
}

function upgrade(toBase: number, team: number) {
    let scene = level1;
    scene.upgrade(toBase, team);
}

function reset(){
    level1.reset();
}



export { game, move, retreat, upgrade, reset };