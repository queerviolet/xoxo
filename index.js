import inquirer from 'inquirer'

import gameReducer, {move} from './game'
import {createStore} from 'redux'

const printBoard = board => {
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'))
    }
    process.stdout.write('\n')
  }
}

const getInput = player => async () => {
  const state = game.getState()
  if (state.turn !== player) return
  const ans = await inquirer.prompt([{
    type: 'input',
    name: 'coord',
    message: `${player}'s move (row,col):`
  }])
  const coord = ans.coord.split(/[,\s+]/).map(x => +x)
  game.dispatch(move(player, coord))
}

const game = createStore(gameReducer)

// Debug: Print the state
game.subscribe(() => console.log(game.getState()))
game.subscribe(() => printBoard(game.getState().board))
game.subscribe(getInput('X'))
game.subscribe(getInput('O'))

game.dispatch({ type: 'START' })
