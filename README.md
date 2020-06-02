# Discord Wars!

A discord game where the chat leads soldiers to battle!

# Development

## Commands
run monogoose web server in the dist folder
`monogoose.exe`
updates the dist folder
```npx webpack```
updates packages
```npm install```

## Game Mechanics

### Types

#### Supporting

UnitChange
- valueUsed: number;
- shouldDestroy: bool;

ChangeableState
- currentValue: number;
- max: number;

change(value: number, state: ChangeableState): UnitChange;

[Healthbar](src/healthbar.ts)
- health: number;
- maxHealth: number;
- addHealth(amt: number): UnitChange;

[LevelSystem](src/support/LevelSystem.ts)
- level: number;
- nextLevel: number;
- experience: number;
- nextRatio: number;
- maxLevel: number;
- upgrade(value: number): UnitChange;

[TeamSystem](src/support/TeamSystem.ts)
each team has a color and an image.  This class allows to change the base team add any time.
The team system also includes a neutral team.  This will be the default team for a base.
- UnitImgKey: string;
- BaseImgKey: string;
- teamId: number;
- color: [number,number,number];

[Player](src/vuemodel.ts)
- name: string;
- team: TeamSystem;
- style: object;
- avatarUrl: string;

[Chat](src/vuemodel.ts)
- name: string;
- message: string;
- player: Player;

#### States

##### Base

[GenerateState](src/BaseStates/GenerateState.ts)
create units every second based on the level of the base.

- base: Base;
- generate(): void;
- unitHit(unit: Unit): void;

[NeutralState](src/BaseStates/NeutralState.ts)
must be repaired before it can be used to generate units.

- base: Base;
- unitHit(unit: Unit): void;


##### Unit

[MoveState](src/UnitStates/MoveState.ts)
move from the current base to the toBase.
- speed: number;
- toBase: Base;

[AttackState](src/UnitStates/AttackState.ts)
attacks the current base
- speed: number;

[OribitState](src/UnitStates/OrbitState.ts)
rotates around the current base
- speed: number;

[SpawnState](src/UnitStates/SpawnState.ts)
moves to the orbit state
- speed: number;
- distance: number;

#### Main

[UserAction](src/UnitStates/UserAction.ts)
represents the move a player makes.  this includes multiple units.
- id: number;
- user: Player;
- units: Unit[];

[Base](src/BaseStates/Base.ts)
- hp: Healthbar;
- team: TeamSystem;
- levelScale: number;
- xp: LevelSystem;
- baseState: BaseState;
- imageKey: string;
- tint: number;

[Unit](src/UnitStates/Unit.ts)
- value: number;
- team: TeamSystem;
- unitState: UnitState;
- currentBase: Base;
- imageKey: string;
- tint: number;
- maxScale: number;

### Attacks
Occurs when an opposite unit attacks another base
- decreases base health
  - goes to neutral state if health <= 0
    - adds the negative value to the neutral base
- decreases unit value
  - deletes if unit value = 0

### Upgrades
Occurs when the base has max health and a matching team unit hits the base
- increase the xp based on the value of the unit
  - destroy the unit
  - if xp >= nextLevel
    - level++
    - nextLevel *= nextRatio

### Repair
Occurs when the base is NOT at max health and a matching team unit hits the base
- increases base health
  - decrease unit value/destroy
  - stop if base health = max health

### Neutrality/Dead
Occurs when health = 0
- must be repaired to use
- when a unit first hits a neutral base, it increases the base health and changes the team
- if health >= maxHealth
  - change to the generate state
- if an opposing team hits the base, decrease the health

### Combining Units
when fps is low, units of the same team are combined, increasing their value
- the unit scale will be increased to the max

# How does the game work?

1. the goal of the game is to DESTROY the other teams.  You do this by destroying all of the teams bases
2. Each base starts out with generating 1 unit per second.  Units can be used to upgrade bases or attacking enemy bases.
3. When a base is upgraded, the units used to upgrade the base are destroyed, but the base now generates 2 units per second.  The base will also have more hitpoints.
4. Some bases can be upgraded more than others and are therefore worth more.
5. If a base is destoyed, it becomes neutral.  Units have to be used to take over a enemy base for it to become yours.
6. bases can be repaired in the game way that bases are upgraded.  Units are used up to upgrade the bases.
# How does this interact with discord?

1. Discord users join a team using the `!join` or `!join 1` command.  This will add them to a team, allowing them to move units in the game.
2. The number of units a user can move is relative to the number of players on their team there are.  If there are 2 players and 100 units on each team, a player can move 50 units at a time.
3. players move units by the `!move` command.  If there is base a and base b, a player can type `!move a b` to move their max number of units from base a to base b.  You can also specify an amount with `!move 10 a b`, or `!move 50% a b`.
4. Players can also upgrade the base by using the command `!upgrade a`,`!upgrade 20% a` or `!upgrade 10 a`.
5. Players can leave the game with the command `!leave`.
6. Players can see their name above the units they are moving and in the player list.
7. Players can cancel a move command by calling `!retreat b`.  This will reverse the units direction away from base b that player controls.

# Commands

| Name     | Args               | Description                                                                      |
| :------- | :----------------- | :------------------------------------------------------------------------------- |
| !join    | 1,2,3,etc...       | Join a team in the game.                                                         |
| !move    | a b, 1 a b, 1% a b | Moves a certain number of units that the players has control over.               |
| !upgrade | a, 10 a, 10% a     | Upgrades a base with a certain number of units that the player has control over. |
| !leave   |                    | player leaves the game.                                                          |
| !retreat | a,b,etc...         | Reverses the player's units movement away from the base specified.               |

# Resources

- http://phaser.io/learn
- https://discordjs.guide/#before-you-begin
- https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=guild
- [Make a bot here](https://discord.com/developers/applications)
- https://vuejs.org/v2/guide/
- https://stackoverflow.com/questions/45995136/export-default-was-not-found
