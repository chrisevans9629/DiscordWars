
import { addHealth } from '../src/BaseStates/IBase';
describe('calculate', function() {
    it('add', function() {
      let result = 5 + 2;
      expect(result).toBe(7);
    });
});

describe('health', function(){
  it('reduce unit 10 with health 200 should use 10', function(){
    let base = {health:200, maxHealth:200};
    let h = addHealth(-10,base);
    expect(h.valueUsed).toBe(10);
    expect(base.health).toBe(190);
  });

  it('add unit 10 with health & max of 200 should use 0', function(){
    let base = {health:200, maxHealth:200};
    let h = addHealth(10, base);
    expect(h.valueUsed).toBe(0);
    expect(base.health).toBe(200);
  });

  let cases = [
    [200,200,10,0,200],
    [200,200,-10,10,190],
    [10,20,-10,10,0],
    [10,20,-20,20,-10],
    [10,20,20,10,20],
  ];

  cases.forEach(p => {
    it(`test health:${p[0]} max:${p[1]} unit:${p[2]} = used:${p[3]} health:${p[4]}`, function(){
      let base = {health:p[0], maxHealth:p[1]};
      let h = addHealth(p[2],base);
      expect(h.valueUsed).toBe(p[3]);
      expect(base.health).toBe(p[4]);
   });
  });

});




