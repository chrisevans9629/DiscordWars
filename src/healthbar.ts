import { UnitChange } from "./BaseStates/BaseState";
import { addHealth } from "./BaseStates/IBase";

export interface IHealthBar {
    health: number;
    maxHealth: number;
    addHealth(amt: number): UnitChange;
    setHealth(amt: number): void;
}

export class HealthBar implements IHealthBar {
    x:number;
    y:number;
    health:number;
    maxHealth:number;
    p:number;
    bar: Phaser.GameObjects.Graphics;
    constructor (scene: Phaser.Scene, x: number, y:number)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.health = 100;
        this.maxHealth = 300;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
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
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.health < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.health);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}