import { ILevel } from "../game";
import { Chat, Player } from "./TeamSystem";
import { OrbitState } from "../UnitStates/OrbitState";
import { AttackState } from "../UnitStates/AttackState";
import { UserAction } from "../UnitStates/UserAction";
import { MoveState } from "../UnitStates/MoveState";

export interface IAction{
    success: boolean;
    reason: string;
}

export interface IBotHandler {
    say(chat: Chat): void;
    upgrade(to: number, team: number): void;
    retreat(to: number, user: Player): IAction;
    move(from: number,to: number,count: number, user: Player): IAction;
}


export class BotHandler implements IBotHandler {
    Level: ILevel
    say(chat: Chat){
        if(!this.Level){
            return;
        }
        this.Level.actions.filter(p => p.user.name == chat.name).forEach(p => {
            p.text.text = `${chat.message}`
            console.log(p.text.text);
        });
        this.Level.SoundSystem.playRandom(this.Level.SoundSystem.blipSounds);
    }
    upgrade(to: number, team: number){
        if(!this.Level){
            return;
        }
        this.Level.units.filter(p => p.currentBase.baseId == to && p.unitState instanceof OrbitState && p.team.teamId == team).forEach(p => {
            p.unitState = (new AttackState(p, this.Level, p.currentBase));
        });
        this.Level.SoundSystem.playRandom(this.Level.SoundSystem.blipSounds);
        //this.SoundSystem.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({volume: this.masterVolume * this.soundVolume });
    }
    retreat(to: number, user: Player){
        if(!this.Level){
            return;
        }
        if(!this.Level.bases.some(p => p.baseId == to)){
            return { success: false, reason: `base ${to} does not exist.`};
        }
        //this.actionid++;

        let action = new UserAction(this.Level, user);
        this.Level.actions.push(action);
        let units = this.Level.units.filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == to && p.team.teamId == user.team.teamId);
        if(units.length == 0){
            return { success: false, reason: `no units found moving to base ${to}`};
        }

        units.forEach(p => {
            p.unitState = (new MoveState(p, this.Level, p.currentBase, action));
        });
        
        this.Level.SoundSystem.playRandom(this.Level.SoundSystem.blipSounds);
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });
        return { success: true, reason: `${units.length} are retreating!`};
    }

    move(from: number,to: number,count: number, user: Player) {
        //this = manager.events.level;
        //let lvl = this;
        if(!this.Level){
            return;
        }
        console.log(`from: ${from} to: ${to} count: ${count}`);

        let bases = this.Level.bases;

        let toBase = bases.find(p => p.baseId == to);

        if(!toBase){
            return { success: false, reason: `to base ${to} does not exist`}
        }

        let action = new UserAction(this.Level, user);
        this.Level.actions.push(action);

        let units = this.Level.units.filter(p => p.currentBase.baseId == from && p.unitState instanceof MoveState != true && p.team.teamId == user.team.teamId).slice(0,count);
        
        if(units.length == 0){
            return { success: false, reason: `did not find units at base ${from}`};
        }
        
        units.forEach(p => {
            p.unitState = (new MoveState(p,this.Level, toBase, action));
        });
        this.Level.SoundSystem.playRandom(this.Level.SoundSystem.blipSounds);
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.soundVolume * this.masterVolume });

        return {success: true, reason: `moving ${units.length} units from ${from} to ${to}`};
    }
}

export let botHandler = new BotHandler();