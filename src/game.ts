import * as Phaser from 'phaser';
import Level1 from './Levels/level1';

import {MainMenu} from './Levels/mainmenu';
import { teams, getTeam, Player, Chat } from './support/TeamSystem';
import { LevelSelect } from './Levels/levelSelect';
import { Level2 } from './Levels/level2';

let config = {
    type: Phaser.AUTO,
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
        //scene: [Level1],
        parent: 'game-parent',
    }
};

let game = new Phaser.Game(config);

let menu = new MainMenu();

let level1 = new Level1();
let select = new LevelSelect();

export interface ILevel {
    title: string
    description: string
    sys: Phaser.Scenes.Systems
}


let level2 = new Level2();


export let Levels: ILevel[] = [level1, level2];


game.scene.add('MainMenu', menu);
game.scene.add('level1', level1);
game.scene.add('LevelSelect', select);
game.scene.add('level2', level2);

game.scene.start('MainMenu');

function move(fromBase: number, toBase: number, count: number, user: Player){
    let scene = level1;
    return scene.move(fromBase, toBase, count, user);
}

function retreat(toBase: number, user: Player){
    let scene = level1;
    return scene.retreat(toBase, user);
}

function upgrade(toBase: number, team: number) {
    let scene = level1;
    return scene.upgrade(toBase, team);
}

function reset(){
    level1.reset();
}

function say(chat: Chat){
    level1.say(chat);
}

function getColor(teamId: number){
    let t = getTeam(teamId).color;
    console.log(t);
    return `rgb(${t[0]},${t[1]},${t[2]})`;
}


function addAvatar(player: Player){
    level1.load.image(player.name,player.avatarUrl);
    console.log(player.avatarUrl);
    level1.load.start();
}

function updateVolume(music: number, sound: number, master: number){
    console.log('updated sound!');
    level1.updateVolume(music, sound, master);
}

function getVolumes(){
    return { music: level1.musicVolume, effects: level1.soundVolume, master: level1.masterVolume };
}

export { game, move, retreat, upgrade, reset, say, getColor, getTeam, addAvatar, updateVolume, getVolumes };
