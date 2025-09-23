import { Chess } from 'chess.js'

type PieceValues = {
  p: number
  n: number
  b: number
  r: number
  q: number
  k: number
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

interface MoveWithEval {
  move: unknown
  evaluation: number
}

export class ChessAI {
  private pieceValues: PieceValues = {
    p: 10,   // Pawn
    n: 30,   // Knight
    b: 30,   // Bishop
    r: 50,   // Rook
    q: 90,   // Queen
    k: 900   // King
  }

  // Position value tables for better piece positioning
  private pawnTable = [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
  ]

  private knightTable = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ]

  private bishopTable = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
  ]

  private rookTable = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
  ]

  private queenTable = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
  ]

  private kingMiddleTable = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
  ]

  private kingEndTable = [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50
  ]

  private getDepth(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'beginner': return 1
      case 'intermediate': return 2
      case 'advanced': return 3
      case 'expert': return 4
      default: return 2
    }
  }

  private getPiecePositionValue(piece: string, square: number, isEndgame: boolean): number {
    const isWhite = piece === piece.toUpperCase()
    const pieceType = piece.toLowerCase()
    
    // Flip square for black pieces
    const position = isWhite ? square : 63 - square
    
    let table: number[]
    switch (pieceType) {
      case 'p': table = this.pawnTable; break
      case 'n': table = this.knightTable; break
      case 'b': table = this.bishopTable; break
      case 'r': table = this.rookTable; break
      case 'q': table = this.queenTable; break
      case 'k': table = isEndgame ? this.kingEndTable : this.kingMiddleTable; break
      default: return 0
    }
    
    return table[position]
  }

  private evaluateBoard(chess: Chess): number {
    const board = chess.board()
    let evaluation = 0
    let whiteMaterial = 0
    let blackMaterial = 0

    // Calculate material and position
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (piece) {
          const squareIndex = i * 8 + j
          const pieceValue = this.pieceValues[piece.type]
          const positionValue = this.getPiecePositionValue(
            piece.color === 'w' ? piece.type.toUpperCase() : piece.type,
            squareIndex,
            false
          )

          if (piece.color === 'w') {
            evaluation += pieceValue + positionValue
            whiteMaterial += pieceValue
          } else {
            evaluation -= pieceValue + positionValue
            blackMaterial += pieceValue
          }
        }
      }
    }

    // Bonus for checkmate
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -99999 : 99999
    }

    // Penalty for stalemate
    if (chess.isDraw() || chess.isStalemate()) {
      return 0
    }

    // Small bonus for check
    if (chess.inCheck()) {
      evaluation += chess.turn() === 'w' ? -50 : 50
    }

    // Bonus for castling rights
    const fen = chess.fen()
    const castlingRights = fen.split(' ')[2]
    if (castlingRights.includes('K') || castlingRights.includes('Q')) evaluation += 20
    if (castlingRights.includes('k') || castlingRights.includes('q')) evaluation -= 20

    // Bonus for controlling center in opening/middle game
    const totalMaterial = whiteMaterial + blackMaterial
    if (totalMaterial > 1500) {
      const centerSquares = ['d4', 'd5', 'e4', 'e5']
      centerSquares.forEach(square => {
        const piece = chess.get(square)
        if (piece) {
          evaluation += piece.color === 'w' ? 10 : -10
        }
      })
    }

    return evaluation
  }

  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
  ): number {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluateBoard(chess)
    }

    const moves = chess.moves()
    
    if (isMaximizingPlayer) {
      let maxEval = -Infinity
      for (const move of moves) {
        chess.move(move)
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false)
        chess.undo()
        maxEval = Math.max(maxEval, evaluation)
        alpha = Math.max(alpha, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of moves) {
        chess.move(move)
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true)
        chess.undo()
        minEval = Math.min(minEval, evaluation)
        beta = Math.min(beta, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }
      return minEval
    }
  }

  public getBestMove(chess: Chess, difficulty: Difficulty = 'intermediate'): string | null {
    const depth = this.getDepth(difficulty)
    const moves = chess.moves() as string[]
    
    if (moves.length === 0) return null

    // For beginner level, add some randomness
    if (difficulty === 'beginner' && Math.random() < 0.3) {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    const isMaximizing = chess.turn() === 'w'
    let bestMove = moves[0]
    let bestValue = isMaximizing ? -Infinity : Infinity

    // Evaluate each move
    for (const move of moves) {
      chess.move(move)
      const evaluation = this.minimax(
        chess,
        depth - 1,
        -Infinity,
        Infinity,
        !isMaximizing
      )
      chess.undo()

      if (isMaximizing) {
        if (evaluation > bestValue) {
          bestValue = evaluation
          bestMove = move
        }
      } else {
        if (evaluation < bestValue) {
          bestValue = evaluation
          bestMove = move
        }
      }
    }

    // Add slight randomness for variety (except on expert)
    if (difficulty !== 'expert') {
      const similarMoves = moves.filter(move => {
        chess.move(move)
        const evaluation = this.minimax(chess, 0, -Infinity, Infinity, !isMaximizing)
        chess.undo()
        return Math.abs(evaluation - bestValue) < 10
      })
      
      if (similarMoves.length > 0) {
        bestMove = similarMoves[Math.floor(Math.random() * similarMoves.length)]
      }
    }

    return bestMove
  }

  // Get move with thinking time simulation
  public async getBestMoveWithDelay(
    chess: Chess,
    difficulty: Difficulty = 'intermediate'
  ): Promise<string | null> {
    // Simulate thinking time based on difficulty
    const thinkingTime = {
      'beginner': 500 + Math.random() * 500,
      'intermediate': 800 + Math.random() * 700,
      'advanced': 1000 + Math.random() * 1000,
      'expert': 1500 + Math.random() * 1500
    }

    await new Promise(resolve => setTimeout(resolve, thinkingTime[difficulty]))
    return this.getBestMove(chess, difficulty)
  }
}