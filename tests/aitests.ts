import { chat } from "../src/support/AI";
import { ITeamInteractor, IPlayer, Chat, getTeam } from "../src/support/TeamSystem";
import { IBotHandler, IAction } from "../src/support/IAction";


class FakeTeamInteractor implements ITeamInteractor {
    players: IPlayer[] = [];
    chat: Chat[] = [];
    addChat(c: Chat){
        this.chat.push(c);
    }
}

let def = { success: true, reason: ''};
class FakeBotHandler implements IBotHandler {
    say(chat: Chat){

    }
    upgrade(to: number, team: number){

    }
    retreat(to: number, user: IPlayer): IAction{
        return def;
    }
    move(from: number, to: number, count: number, user: IPlayer){
        return def;
    }
    moveAll(to: number, count: number, user: IPlayer){
        return def;
    }
}



describe('AI Tests', () => {
    
    it('no bases should not fail', () => {
        let fakeT = new FakeTeamInteractor();
        let fakeBot = new FakeBotHandler();
        chat([], () => 1, fakeT, fakeBot);
    });

    it('should create two chats', () => {
        let fakeT = new FakeTeamInteractor();
        let fakeBot = new FakeBotHandler();
        chat([{team: {teamId: 1, score: 10}, xp: {level: 1} }, {team: {teamId: 2, score: 10}, xp: {level: 1}}], () => 1, fakeT, fakeBot);
        expect(fakeT.chat.length).toBe(2);
    });

    it('test',() => {
        expect('test').toBe('test');
    })
});