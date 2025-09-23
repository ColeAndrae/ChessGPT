// Type declarations for chess.js when @types/chess.js is not sufficient
declare module 'chess.js' {
  export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
  export type PieceColor = 'w' | 'b'
  
  export interface Piece {
    type: PieceType
    color: PieceColor
  }

  export interface Move {
    from: string
    to: string
    piece: PieceType
    captured?: PieceType
    promotion?: PieceType
    flags: string
    san: string
    lan: string
    before: string
    after: string
  }

  export interface MoveOptions {
    sloppy?: boolean
    verbose?: boolean
  }

  export interface SquareMoveOptions extends MoveOptions {
    square: string
  }

  export class Chess {
    constructor(fen?: string)
    
    load(fen: string): boolean
    reset(): void
    move(move: string | { from: string; to: string; promotion?: string }): Move | null
    moves(options?: MoveOptions | SquareMoveOptions): string[] | Move[]
    inCheck(): boolean
    isCheckmate(): boolean
    isStalemate(): boolean
    isDraw(): boolean
    isGameOver(): boolean
    fen(): string
    board(): (Piece | null)[][]
    turn(): PieceColor
    get(square: string): Piece | null
    put(piece: { type: PieceType; color: PieceColor }, square: string): boolean
    remove(square: string): Piece | null
    undo(): Move | null
    clear(): void
    history(options?: { verbose?: boolean }): string[] | Move[]
  }
}