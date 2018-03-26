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

const printError = () => {
  const {error} = game.getState()
  if (error) console.error(error)
}

const getInput = player => async () => {
  const {turn} = game.getState()  
  if (turn !== player) return
  const ans = await inquirer.prompt([{
    type: 'input',
    name: 'coord',
    message: `${turn}'s move (row,col):`
  }])
  const [row=0, col=0] = ans.coord.split(/[,\s+]/).map(x => +x)
  game.dispatch(move(turn, [row, col]))
}

const exitOnWin = () => {
  const {winner} = game.getState()
  if (winner) {
    console.log(winner, 'wins!')
    process.exit(0)
  }
}

import play from './game/ai'

const ai = player => () => {
  const state = game.getState()
  if (state.turn !== player) return
  if (state.winner) return
  const move = play(game.getState())
  console.log(`🤖 ${player} moves to ${move.coord}`)
  game.dispatch(move)
}

const game = createStore(gameReducer)

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()))

game.subscribe(printBoard)
game.subscribe(printError)
game.subscribe(getInput('X'))
game.subscribe(ai('O'))
game.subscribe(exitOnWin)


game.dispatch({ type: 'START' })
