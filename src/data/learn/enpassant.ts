import { Color } from 'chessground/types';
import { arrow, Stage, toLevel } from '../util';

const Learn: Stage = {
  key: 'enpassant',
  levels: [
    {
      goal: 'blackJustMovedThePawnByTwoSquares',
      fen: 'rnbqkbnr/pppppppp/8/2P5/8/8/PP1PPPPP/RNBQKBNR b KQkq -',
      color: 'white' as Color,
      nbMoves: 1,
      detectCapture: false,
      scenario: [
        {
          move: 'd7d5',
          shapes: [arrow('c5d6')],
        },
        'c5d6',
      ],
      captures: 1,
    },
    {
      goal: 'enPassantOnlyWorksImmediately',
      fen: 'rnbqkbnr/ppp1pppp/8/2Pp3P/8/8/PP1PPPP1/RNBQKBNR b KQkq -',
      color: 'white' as Color,
      nbMoves: 1,
      detectCapture: false,
      scenario: [
        {
          move: 'g7g5',
          shapes: [arrow('h5g6'), arrow('c5d6', 'red')],
        },
        'h5g6',
      ],
      captures: 1,
    },
    {
      goal: 'enPassantOnlyWorksOnFifthRank',
      fen: 'rnbqkbnr/pppppppp/P7/2P5/8/8/PP1PPPP1/RNBQKBNR b KQkq -',
      color: 'white' as Color,
      nbMoves: 1,
      detectCapture: false,
      scenario: [
        {
          move: 'b7b5',
          shapes: [arrow('c5b6'), arrow('a6b7', 'red')],
        },
        'c5b6',
      ],
      captures: 1,
      cssClass: 'highlight-5th-rank',
    },
    {
      goal: 'takeAllThePawnsEnPassant',
      fen: 'rnbqkbnr/pppppppp/8/2PPP2P/8/8/PP1P1PP1/RNBQKBNR b KQkq -',
      color: 'white' as Color,
      nbMoves: 4,
      detectCapture: false,
      scenario: ['b7b5', 'c5b6', 'f7f5', 'e5f6', 'c7c5', 'd5c6', 'g7g5', 'h5g6'],
      captures: 4,
    },
  ].map(toLevel),
};

export default Learn;
