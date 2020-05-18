import Phaser from 'phaser';
import Level1 from './Levels/level1';
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [Level1],
    parent: 'game-parent'
};

var game = new Phaser.Game(config);
