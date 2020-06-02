import { UnitChange } from "./BaseState";

export interface IHealth {
    health: number;
    maxHealth: number;
}

export function addHealth(amt: number, base: IHealth): UnitChange {
    //health = 5;
    //max = 12;

    //7; 1
    let used = 0;
    if(amt + base.health >= base.maxHealth) {
        used = base.maxHealth - base.health;
        base.health = base.maxHealth;
        //-100 + 10 <= -30;  -90 <= -30;
    } else if(amt + base.health <= -base.maxHealth) {
        //30+10 = 40;
        used = base.health + base.maxHealth;
        base.health = base.maxHealth;
    } else {
        used = Math.abs(amt);
        base.health += amt;
    }
    return { valueUsed: used, shouldDestroy: used >= Math.abs(amt) };
}