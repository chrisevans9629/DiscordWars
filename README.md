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

Healthbar
- health: number;
- maxHealth: number;

LevelSystem
- level: number;
- nextLevel: number;
- experience: number;
- nextRatio: number;

#### States

##### Base

GenerateState
create units every second based on the level of the base.

- base: Base;
- generate(): void;
- unitHit(unit: Unit): void;

NeutralState
must be repaired before it can be used to generate units.

- base: Base;
- unitHit(unit: Unit): void;

##### Unit

MoveState
move from the current base to the toBase.
- speed: number;
- toBase: Base;

AttackState
attacks the current base
- speed: number;

OribitState
rotates around the current base
- speed: number;

SpawnState
moves to the orbit state
- speed: number;
- distance: number;

#### Main

Base
- hp: Healthbar;
- team: number;
- xp: LevelSystem;
- baseState: BaseState;
- imageKey: string;
- tint: number;

Unit
- value: number;
- team: number;
- unitState: UnitState;
- currentBase: Base;
- imageKey: string;
- tint: number;

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
