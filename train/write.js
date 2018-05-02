import reduce from '../game'
import play, {score, moves, COORDS} from '../game/ai'

const str = game =>
  COORDS.map(coord => game.board.getIn(coord, '_')).join('')

const print = (game, coord) => console.log('%s,%s', str(game), coord)

const initialScores = [
  -1, -1, -1,
  -1, -1, -1,
  -1, -1, -1,
]
const buildTrainingData = (output=print, game=reduce(undefined, {type: '@@INIT'})) => {
  if (game.winner) return output(game, initialScores)
  
  const scores = [...initialScores]
  moves(game)
    .forEach(move => {
      scores[3 * move.coord[0] + move.coord[1]] = score(game, move)
      buildTrainingData(output, reduce(game, move))      
    })
  output(game, scores)  
}

const games = {}
buildTrainingData((game, scores) => games[str(game)] = scores)
console.log(JSON.stringify(games))
console.error('wrote', Object.keys(games).length, 'score matrices')