import { addHealth } from "./BaseStates/IBase";
import { IHealthBar } from "./IHealthBar";
import { ProgressBar } from "./ProgressBar";
import { soundSystem } from "./game";

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
        let ratio = this.health/this.maxHealth;
        if(ratio >= 1){
            soundSystem.play(soundSystem.healed,0);
        }
        else{
            soundSystem.play(soundSystem.healing, ratio*1000);
        }

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