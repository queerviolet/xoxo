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

function board(board=Map(), action) {
  if (action.type === MOVE)
    return board.setIn(action.coord, action.player)
  return board
}

export default combineReducers({turn, board})