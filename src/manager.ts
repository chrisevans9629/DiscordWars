//import { Scene } from 'phaser'

var events = {
    move: function(from: number, to: number, amt: number) {},
    //level: Scene
};

events.move = (from,to,amt) => { console.log("moved!")};
export {events};
