export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type PieceColor = 'w' | 'b'
export type Square = string // e.g., 'a1', 'e4'

export interface Piece {
  type: PieceType
  color: PieceColor
  square: Square
}

export interface GameState {
  fen: string
  turn: PieceColor
  history: string[]
  isCheck: boolean
  isCheckmate: boolean
  isDraw: boolean
  isStalemate: boolean
}

export interface Move {
  from: Square
  to: Square
  promotion?: PieceType
}