
import { addHealth } from '../src/BaseStates/IBase';
import { tween } from '../src/support/TeamSystem';
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
    { health: 200,max:200,unit: 10,used: 0,healthResult: 200, destroy: false},
    { health: 200,max:200,unit:-10,used:10,healthResult: 190, destroy: true},
    { health: 10 ,max:20 ,unit:-10,used:10,healthResult:   0, destroy: true},
    { health: 10 ,max:20 ,unit:-20,used:20,healthResult: -10, destroy: true},
    { health: 10 ,max:20 ,unit: 20,used:10,healthResult:  20, destroy: false},
    { health: 100 ,max:300 ,unit: 1,used:1,healthResult:  101, destroy: true},
  ];

  cases.forEach(p => {
    it(`test health:${p.health} max:${p.max} unit:${p.unit} = used:${p.used} health:${p.healthResult}`, function(){
      let base = {health:p.health, maxHealth:p.max};
      let h = addHealth(p.unit,base);
      expect(h.valueUsed).toBe(p.used);
      expect(base.health).toBe(p.healthResult);
      expect(h.shouldDestroy).toBe(p.destroy);
   });
  });

});


describe('color', () => {
  let cases = [
    { from: 0, to: 10, percent: 0.5, result: 5 },
    { from: 0, to: 20, percent: 0.5, result: 10 },
    { from: 10, to: 20, percent: 0.5, result: 15 },
    { from: 20, to: 20, percent: 0.5, result: 20 },
    { from: 20, to: 10, percent: 0.5, result: 15 },
    { from: 0, to: 100, percent: 0.25, result: 25 },
    { from: 100, to: 100, percent: 1, result: 100 },
    { from: 100, to: 100, percent: 0.5, result: 100 },
    { from: 100, to: 100, percent: 0.25, result: 100 },
    { from: 50, to: 150, percent: 0.25, result: 75 },
    { from: 255, to: 0, percent: 0.2, result: 255-51 },
    { from: 100, to: 0, percent: 0.1, result: 90 },
    { from: 100, to: 0, percent: 0.2, result: 80 },
    { from: 100, to: 0, percent: 0.3, result: 70 },
  ];

  cases.forEach(p => {
    it(`f:${p.from} t:${p.to} %:${p.percent} r:${p.result}`, () => {
       let avg = tween(p);
       expect(avg).toBe(p.result);
    });
  });
});



