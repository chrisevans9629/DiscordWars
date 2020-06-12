import { UnitChange } from "./BaseStates/BaseState";
import { addHealth } from "./BaseStates/IBase";
import { Scene } from "phaser";

export interface IHealthBar {
    health: number;
    maxHealth: number;
    isFullHealth: boolean;
    addHealth(amt: number): UnitChange;
    setHealth(amt: number): void;
}

export class ProgressBar {
    x: number;
    y: number;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    value: number;
    padding: number;
    maxValue: number;
    alpha: number;
    scene: Scene;
    goodColor: number;
    badColor: number;
    constructor(scene: Scene,x: number, y: number){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.width = 80;
        this.height = 16;
        this.padding = 2;
        this.x = x;
        this.y = y;
        this.goodColor = 0x00ff00;
        this.badColor = 0xff0000;
        this.maxValue = 100;
        this.alpha = 1;
        this.scene = scene;
        //this.health = 100;
        //this.maxHealth = 100;
        scene.add.existing(this.bar);
        //this.timer = scene.time.addEvent({delay: 1000, callback: this.fadeOut, callbackScope: this});
        //this.draw();
    }

    //timer: Phaser.Time.TimerEvent;
    
    tween: Phaser.Tweens.Tween;
    draw() {
       this.alpha = 1;
       this.render();
       if(this.tween){
           this.scene.tweens.remove(this.tween);
       }
       this.tween = this.scene.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 1000,
            delay: 1000,
            onUpdate: function (tween)
            {
                var value = tween.getValue();
                this.alpha = value;
                this.render();
            },
            onUpdateScope: this,
        });
    }

    render(){
        if(this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        this.bar.clear();

        let x = this.x - this.width / 2;
        let y = this.y - this.height / 2;

        let widthPad = this.width - this.padding * 2;
        let heightPad = this.height - this.padding * 2;
        let valueRatio = widthPad / this.maxValue;
        //  BG
        this.bar.fillStyle(0x000000, this.alpha);
        this.bar.fillRect(x, y, this.width, this.height);

        //  Health

        this.bar.fillStyle(0xffffff, this.alpha);
        this.bar.fillRect(
            x + this.padding,
            y + this.padding,
            widthPad,
            heightPad);

        if (this.value < this.maxValue / 3)
        {
            this.bar.fillStyle(this.badColor, this.alpha);
        }
        else
        {
            this.bar.fillStyle(this.goodColor, this.alpha);
        }

        var d = Math.floor(valueRatio * this.value);
        //console.log(this);
        //console.log(d);
        this.bar.fillRect(x + this.padding, y + this.padding, d, heightPad);
    }
}


export class HealthBar implements IHealthBar {
   // private x:number;
   // private y:number;
    private _health:number;
    get health(){
        return this._health;
    }
    set health(hp){
        this._health = hp;
        this.draw();
    }
    private _maxHealth:number;
    get maxHealth(){
        return this._maxHealth;
    }
    set maxHealth(hp){
        this._maxHealth = hp;
        this.draw();
    }

   // private valueRatio:number;
   // bar: Phaser.GameObjects.Graphics;
    get isFullHealth(){
        return this.health >= this.maxHealth;
    }
    progressBar: ProgressBar;
    constructor (scene: Phaser.Scene, x: number, y:number)
    {
        this.progressBar = new ProgressBar(scene, x, y);
        this.progressBar.alpha = 0.5;
        this.progressBar.draw();
        //this.bar = new Phaser.GameObjects.Graphics(scene);

        //this.x = x;
        //this.y = y;
        //this.health = 100;
        //this.maxHealth = 100;
        //this.valueRatio = 76 / 100;

        //this.draw();

    }
    addHealth(amt: number){
        let t = addHealth(amt, this);
        this.draw();
        return t;
    }
    setHealth(amt: number){
        this.health = amt;
        this.draw();
    }
    decrease (amount: number)
    {
        this.health -= amount;

        if (this.health < 0)
        {
            this.health = 0;
        }

        this.draw();

        return (this.health === 0);
    }

    draw ()
    {
        this.progressBar.maxValue = this._maxHealth;
        this.progressBar.value = this._health;
        this.progressBar.draw();
    }

}