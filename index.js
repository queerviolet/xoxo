import inquirer from 'inquirer'

import gameReducer, {move} from './game'
import {createStore} from 'redux'

const printBoard = () => {
  const {board} = game.getState()
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'))
    }
    process.stdout.write('\n')
  }
}

const getInput = async () => {
  const {turn} = game.getState()  
  const ans = await inquirer.prompt([{
    type: 'input',
    name: 'coord',
    message: `${turn}'s move (row,col):`
  }])
  const [row=0, col=0] = ans.coord.split(/[,\s+]/).map(x => +x)
  game.dispatch(move(turn, [row, col]))
}

const exitOnWin = ({winner}) => {
  if (winner) {
    console.log(winner, 'wins!')
    process.exit(0)
  }
}

const game = createStore(gameReducer)

// Debug: Print the state
game.subscribe(() => console.log(game.getState()))

game.subscribe(printBoard)
game.subscribe(() => exitOnWin(game.getState()))
game.subscribe(getInput)

game.dispatch({ type: 'START' })
