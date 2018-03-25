# Version 1: The honor system

## Goal

Today, we're going to make [tic-tac-toe](https://en.wikipedia.org/wiki/Tic-tac-toe)
(also called noughts and crosses, or Xs and Os).

Our first version will be a terminal app. Players will be able to:
  - Take turns making moves
  - See the board printed after each move

We *won't* have these features:
  - The game won't keep players from making invalid moves.
    - In particular, nothing will prevent players from moving into
      a square that's already occupied.
  - The game won't know when it's over—it's up to players to notice
    who won.
  - We won't have AI.
  - We won't have a web frontend.

We'll add these features later. Let's put together a simple game, played on
the honor system, first.

Here's an example of a play session:

```
___
___
___
? X's move (row,col): 1,1

___
_X_
___
? O's move (row,col): 2,2

___
_X_
__O
? X's move (row,col): 0,2

__X
_X_
__O
? O's move (row,col): 2,1

__X
_X_
_OO
? X's move (row,col): 2,0

__X
_X_
XOO
? O's move (row,col):
```

X has won the game. Our first version doesn't detect this—X's player has to notice
and start gloating.

We'll use [Redux](https://redux.js.org) to manage the state of the board.

## Redux

Redux gives us a framework for thinking about the game rules, by
breaking the problem down into three parts.
    * We have *state*, which will represent the current state of the game
    * *Actions* are objects that describe changes to the game.    
    * We have a *reducer*, which takes a state and an action
      and returns a new state.

To tie it all together, Redux gives us the *store*. The store holds a particular state,
and has a `dispatch` method, which takes an action, and uses your reducer to compute
the next state.

## State — Immutable Maps

For our MVP design, our game state needs to be able to answer two questions:
    1. whose turn is it?
    2. what's on the board?

We'll track the answers to these questions in an object like this:

  - `turn` — whose turn is it?
    - turn is a string: 'X' or 'O'
  - `board` — what's on the board?
    - board is an [Immutable Map](https://facebook.github.io/immutable-js/docs/#/Map).

### Immutable Maps

An Immutable Map is much like a normal map, only methods that *would* mutate
the map instead return a copy with those changes applied.

<tonic>
const {Map} = require('immutable')
const empty = Map()

const full = empty
  .set('hello', 'world')
  .set('x', 123)

console.log(full)

// The original map is unchancged.
console.log(empty)
</tonic>

This behavior is perfect for Redux states, which are meant to be completely
immutable. The immutable library is smart enough to only make a copy of the keys that need
to change, reducing memory usage.

Immutable maps also have some very useful methods. In particular, you can set
deep values based on a key path. For example:

<tonic>
const {Map} = require('immutable')
Map().setIn(['hello', 'world'], 42)
</tonic>

This returns an immutable map with a single key, `"hello"`,
whose value is an immutable map with a single key, `"world"`,
whose value is 42. If we turned it into JSON, it would look like
this:

```js
{
  hello: {
    world: 42
  }
}
```

<guide>
Consider: how can represent the xoxo board with an immutable map?
</guide>

## State — moves on the board

If we decide to represent board coordinates as an array of [row, col],
then our coordinates will naturally be key paths, which we can
use with `getIn` and `setIn`.

An empty board will be a Map with no entries.

```js
const {Map} = require('immutable')
let board = Map()
```

When a player makes a move, we'll want to create a new board at
that coordinate. For example, if X moves to row 1, col 1, we'll
compute the new board as:

```js
board.setIn([1, 1], 'X')
```

We'll need to store this information in the `MOVE` action.

<guide>Consider what the `MOVE` action will look like.</guide>

## Actions

In tic-tac-toe, there's really only one action a player
can take, and that's to make a move, marking a board position
with their marker (X or O).

The action will need to tell us which player is moving, and
where they're moving to:

  * `MOVE`
    - type: "MOVE"
    - position: [row: 0..2, col: 0..2]
    - player: 'X' or 'O'

To ensure that our move actions have the appropriate form, we'll
write an *action creator* for moves. This is a function that takes 
and return an action representing that player marking that position.

<guide>Write the move action creator in [`game/index.js`](./game/index.js)</guide>

## Reducer

Your reducer will need to take a state and action. If the action is a MOVE,
it will return a *new* state with the move written to the board, and the
turn flipped from 'X' to 'O' or from 'O' to 'X'.

<guide>Write the reducer in [`game/index.js`](./game/index.js)</guide>

## Try it out!

Try out your game by running `npm start`. If you've written your functions
correctly, it should all work!

Look over the code in [`index.js`](./index.js), where we create the store,
and then subscribe a couple of functions that do the work of (1) printing
the board, and (2) asking for user input. We'll need to extend this code
in the next section, when we add winner validation.