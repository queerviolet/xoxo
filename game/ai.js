import {Map} from 'immutable'
import reducer, {move, bad} from '.'

const COORDS = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
]

export const moves = game => moves[game.turn]
  .filter(move => !bad(game, move))

moves.X = COORDS.map(coord => move('X', coord))
moves.O = COORDS.map(coord => move('O', coord))

const score = (game, move) => {
  const future = reducer(game, move)
  if (future.winner === move.player) return 1
  if (future.winner === 'draw') return 0

  if (!future.winner)
    // The game is still ongoing.
    // Find the best move for our opponent, and return the negation
    // of it.
    // That means that if the best our opponent can do is win (1),
    // then we score this move as -1, a loss, and vice versa.
    return -Math.max(...moves(future).map(move => score(future, move)))
  
  // Otherwise, the other person won. Score this move as -1.
  return -1
}

/**
 * Return the best action for the current player.
 * 
 * @param {} state 
 */
export default state => moves(state)
    .map(move => Object.assign({}, move, {
      score: score(state, move)
    }))
    .sort((a, b) => b.score - a.score)
    [0]
