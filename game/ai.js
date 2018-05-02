import reducer, {move, bad} from '.'

export const COORDS = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
]

export const moves = game => moves[game.turn]
  .filter(move => !bad(game, move))

moves.X = COORDS.map(coord => move('X', coord))
moves.O = COORDS.map(coord => move('O', coord))

const memoize = (key, cache={}) => func => {
  const memoized = (...args) => {
    const k = key(...args)
    return k in cache
      ? cache[k]
      : cache[k] = func(...args, memoized)
  }
  memoized.cache = cache
  return memoized
}

const key = (game, move) => JSON.stringify([game, move])

const sum = a => a.reduce((x, y) => x + y, 0)

export const score = memoize(key)((game, move, self=score) => {
  const future = reducer(game, move)
  if (future.winner === move.player) return 1
  if (future.winner === 'draw') return 0

  if (!future.winner) {
    // The game is still ongoing.

    // Recursively compute the scores of all of our opponent's
    // possible moves. These scores are for our opponent, so they're
    // flipped—1 means we lose, -1 means we win.
    const outcomes = moves(future)
      .map(move => self(future, move, self))

    // Find all (our) losses. If there are any,
    // we must assume that our opponent will take them (they won't
    // pass up an opportunity to win). Return the negative of the sum
    // of all losing moves, multiplied by 0.1 so that we weight
    // immediate losses more heavily than possible future losses.
    const losses = outcomes.filter(_ => _ > 0)
    if (losses.length) return -sum(losses) * 0.1

    // Same thing for wins.
    const wins = outcomes.filter(_ => _ < 0)
    if (wins.length) return -sum(wins) * 0.1

    // No wins or losses? The score for this move is 0.
    return 0
  }
  
  // Otherwise, the other person won. Score this move as -1.
  return -1
})

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
