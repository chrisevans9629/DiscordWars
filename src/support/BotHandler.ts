import { ILevel, soundSystem } from "../game";
import { Chat, IPlayer } from "./TeamSystem";
import { OrbitState } from "../UnitStates/OrbitState";
import { AttackState } from "../UnitStates/AttackState";
import { UserAction } from "../UnitStates/UserAction";
import { MoveState } from "../UnitStates/MoveState";
import { IBotHandler } from "./IAction";

export class BotHandler implements IBotHandler {
    Level: ILevel
    say(chat: Chat){
        if(!this.Level){
            return;
        }
        let actions = this.Level.actions.filter(p => p.user.name == chat.name);

        if(actions.length > 0){
            let p = actions[0];
            p.text.text = `${chat.message}`
            if(chat.message.length > 10){
                let ratio = chat.message.length * 0.05;
                p.text.setFontSize(20/ratio)
            }
            else{
                p.text.setFontSize(20);
            }
        }
        soundSystem.playBlip();
    }
    upgrade(to: number, team: number){
        if(!this.Level){
            return;
        }
        this.Level.units.filter(p => p.currentBase.baseId == to && p.unitState instanceof OrbitState && p.team.teamId == team).forEach(p => {
            p.unitState = (new AttackState(p, this.Level, p.currentBase));
        });
        soundSystem.playBlip();
        //this.SoundSystem.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({volume: this.masterVolume * this.soundVolume });
    }
    retreat(to: number, user: IPlayer){
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
        
        soundSystem.playBlip();
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });
        return { success: true, reason: `${units.length} are retreating!`};
    }
    moveAll(to: number, count: number, user: IPlayer){
        if(!this.Level){
            return;
        }

        let bases = this.Level.bases;

        let toBase = bases.find(p => p.baseId == to);

        if(!toBase){
            return { success: false, reason: `to base ${to} does not exist`}
        }

        let action = new UserAction(this.Level, user);
        this.Level.actions.push(action);

        let units = this.Level.units.filter(p => p.unitState instanceof MoveState != true && p.team.teamId == user.team.teamId).slice(0,count);
        
        if(units.length == 0){
            return { success: false, reason: `did not find units`};
        }
        
        units.forEach(p => {
            p.unitState = (new MoveState(p,this.Level, toBase, action));
        });
        soundSystem.playBlip();
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.soundVolume * this.masterVolume });

        return {success: true, reason: `moving ${units.length} units to ${to}`};
    }
    move(from: number,to: number,count: number, user: IPlayer) {
        if(!this.Level){
            return;
        }

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
        soundSystem.playBlip();
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.soundVolume * this.masterVolume });

        return {success: true, reason: `moving ${units.length} units from ${from} to ${to}`};
    }
}

export let botHandler = new BotHandler();