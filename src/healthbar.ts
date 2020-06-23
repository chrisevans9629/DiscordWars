import { addHealth } from "./BaseStates/IBase";
import { IHealthBar } from "./IHealthBar";
import { ProgressBar } from "./ProgressBar";
import { soundSystem } from "./game";

export class HealthBar implements IHealthBar {
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
    get isFullHealth(){
        return this.health >= this.maxHealth;
    }
    progressBar: ProgressBar;
    constructor (scene: Phaser.Scene, x: number, y:number)
    {
        this.progressBar = new ProgressBar(scene, x, y);
        this.progressBar.alpha = 0.5;
        this.progressBar.draw();
    }
    addHealth(amt: number){
        let t = addHealth(amt, this);
        this.draw();
        let ratio = this.health/this.maxHealth;
        if(ratio >= 1){
            soundSystem.playHealed();
        }
        else{
            soundSystem.playHealing(ratio);
        }
        return t;
    }
    setHealth(amt: number){
        this.health = amt;
        this.draw();
    }
    draw ()
    {
        if(this._health <= 0){
            this._health = 0;
        }
        this.progressBar.maxValue = this._maxHealth;
        this.progressBar.value = this._health;
        this.progressBar.draw();
    }

}