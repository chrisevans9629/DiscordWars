
import { addHealth } from '../src/BaseStates/IBase';
describe('calculate', function() {
    it('add', function() {
      let result = 5 + 2;
      expect(result).toBe(7);
    });
});

describe('health', function(){
  it('unit 10 with health 200 should use 10', function(){
    let base = {health:200, maxHealth:200};
    let h = addHealth(10,base);
    expect(h.valueUsed).toBe(10);
    expect(base.health).toBe(190);
  });
});




