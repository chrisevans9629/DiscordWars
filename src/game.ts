import * as Phaser from 'phaser';
import Level1 from './Levels/level1';

import {MainMenu} from './Levels/mainmenu';
import { teams, getTeam, IPlayer, Chat } from './support/TeamSystem';
import { LevelSelect } from './Levels/levelSelect';
import { Level2 } from './Levels/level2';
import { Base } from './BaseStates/Base';
import { Unit } from './UnitStates/Unit';
import { UserAction } from './UnitStates/UserAction';
import { ISoundSystem, SoundSystem } from './support/SoundSystem';
import { botHandler } from './support/BotHandler';
import { State } from './UnitStates/State';
import { Level3 } from './Levels/level3';
import { Level4 } from './Levels/level4';
import { Level5 } from './Levels/level5';
import { ParticleEngine } from './support/ParticleEngine';
import { Login } from './Levels/login';

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

let select = new LevelSelect();

export interface ILevel {
    title: string
    description: string
    sys: Phaser.Scenes.Systems
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
    //SoundSystem: ISoundSystem;
    physics: Phaser.Physics.Arcade.ArcadePhysics;
    add: Phaser.GameObjects.GameObjectFactory;
    scene: Phaser.Scenes.ScenePlugin;
    reset(): void;
    time: Phaser.Time.Clock;
    gameState: State<ILevel>;
    particleEngine: ParticleEngine;
    load: Phaser.Loader.LoaderPlugin;
    destroyUnit(unit: Unit): void;
    fps: number;
}


// let level1 = new Level1();
// let level2 = new Level2();
// let level3 = new Level3();
// let level4 = new Level4();
export let Levels: ILevel[] = [
    new Level1(), 
    new Level2(), 
    new Level3(), 
    new Level4(), 
    new Level5()];


game.scene.add('MainMenu', menu);
game.scene.add('LevelSelect', select);
game.scene.add('login', new Login());
Levels.forEach(p => {
    let s = p as unknown as Phaser.Scene;
    game.scene.add(p.sys.settings.key, s);
});

game.scene.start('login');
export let soundSystem: SoundSystem = new SoundSystem(game.sound);

let handler = botHandler;

function move(fromBase: number, toBase: number, count: number, user: IPlayer){
    return handler.move(fromBase, toBase, count, user);
}

function retreat(toBase: number, user: IPlayer){
    return handler.retreat(toBase, user);
}

function upgrade(toBase: number, team: number) {
    return handler.upgrade(toBase, team);
}

function reset(){
    handler.Level.reset();
}

function say(chat: Chat){
    handler.say(chat);
}

function getColor(teamId: number){
    let t = getTeam(teamId).color;
    //console.log(t);
    return `rgb(${t[0]},${t[1]},${t[2]})`;
}


function addAvatar(player: IPlayer){
    handler.Level.load.image(player.name,player.avatarUrl);
    handler.Level.load.start();
}

function updateVolume(music: number, sound: number, master: number){
    //console.log('updated sound!');
    soundSystem.updateVolume(music, sound, master);
}

function getVolumes(){
    return { 
        music: soundSystem.musicVolume,
        effects: soundSystem.soundVolume, 
        master: soundSystem.masterVolume };
}

export { game, move, retreat, upgrade, reset, say, getColor, getTeam, addAvatar, updateVolume, getVolumes };
