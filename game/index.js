import {combineReducers} from 'redux'
import {Map} from 'immutable'

export const MOVE = 'MOVE'
/**
 * move(player: 'X'|'O', coord: [row: 0...2, col: 0...2])
 * 
 * Return a move action. 
 */
export const move = (player, coord) => ({
  type: MOVE,
  player, coord
})

function turn(current='X', action) {
  if (action.type === MOVE)
    return current === 'X' ? 'O' : 'X'
  return current
}

function board(board=Map(), {type, coord, player}) {
  if (type === MOVE)
    return board.setIn(coord, player)
  return board
}

function streak(board, first, ...rest) {
  const player = board.getIn(first)
  if (!player) return false
  for (let c of rest) {
    if (board.getIn(c) !== player) return false
  }
  return player
}

const PLAYING = 0, X_WIN = 1, O_WIN = 2, DRAW = 3
export function winner(board) {
  let i = 3; while (--i >= 0) {
    let row = streak(board, [0, i], [1, i], [2, i])
    if (row) return row
    let col = streak(board, [i, 0], [i, 1], [i, 2])
    if (col) return col
  }

  let diagDown = streak(board, [0, 0], [1, 1], [2, 2])
  if (diagDown) return diagDown
  
  const diagUp = streak(board, [2, 0], [1, 1], [0, 2])
  if (diagUp) return diagUp
  
  // Any spaces mean we're still playing
  let r = 3; while (--r >= 0) {
    let c = 3; while (--c >= 0)
      if (!board.hasIn([r, c])) return null
  }

  // Otherwise, it's a draw.
  return 'draw'
}

export const bad = ({turn, board}, {type, player, coord}) => {
  if (type !== MOVE) return
  if (player !== turn) return `It's not ${player}'s turn`
  if (coord.length !== 2)
    return `Specify row,column`
  const [row, col] = coord
  if (!Number.isInteger(row) || row < 0 || row > 2)
    return `Invalid row (must be 0-2): ${row}`
  if (!Number.isInteger(col) || col < 0 || col > 2)
    return `Invalid column (must be 0-2): ${col}`
  if (board.hasIn(coord))
    return `Square ${coord} is already taken`  
}

export default function reducer(game={}, action) {
  const error = bad(game, action)
  if (error) return Object.assign({}, game, {error})
  const nextBoard = board(game.board, action)
  return {
    winner: winner(nextBoard),
    turn: turn(game.turn, action),
    board: nextBoard,
  }
}