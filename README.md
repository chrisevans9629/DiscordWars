# Discord Wars!

A discord game where the chat leads soldiers to battle!

# Development

## Commands
updates the dist folder
```npx webpack```
updates packages
```npm install```

# How does the game work?

1. the goal of the game is to DESTROY the other teams.  You do this by destroying all of the teams bases
2. Each base starts out with generating 1 unit per second.  Units can be used to upgrade bases or attacking enemy bases.
3. When a base is upgraded, the units used to upgrade the base are destroyed, but the base now generates 2 units per second.  The base will also have more hitpoints.
4. Some bases can be upgraded more than others and are therefore worth more.
5. If a base is destoyed, it becomes neutral.  Units have to be used to take over a enemy base for it to become yours.

# How does this interact with discord?

1. Discord users join a team using the `!join` or `!join 1` command.  This will add them to a team, allowing them to move units in the game.
2. The number of units a user can move is relative to the number of players on their team there are.  If there are 2 players and 100 units on each team, a player can move 50 units at a time.
3. players move units by the `!move` command.  If there is base a and base b, a player can type `!move a b` to move their max number of units from base a to base b.  You can also specify an amount with `!move 10 a b`, or `!move 50% a b`.
4. Players can also upgrade the base by using the command `!upgrade a`,`!upgrade 20% a` or `!upgrade 10 a`.
5. Players can leave the game with the command `!leave`.
6. Players can see their name above the units they are moving and in the player list.
7. Players can cancel a move command by calling `!retreat b`.  This will reverse the units direction away from base b that player controls.

# Commands

|Name|Args|Description|
|---|---|---|
|!join|1,2,3,etc...|Join a team in the game.
|!move|a b, 1 a b, 1% a b|Moves a certain number of units that the players has control over.
|!upgrade|a, 10 a, 10% a|Upgrades a base with a certain number of units that the player has control over.
|!leave||player leaves the game.
|!retreat|a,b,etc...|Reverses the player's units movement away from the base specified.