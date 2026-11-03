export const GLOBAL = {
  CHUNK: 50,
  MATRIX_READ: 500,
  PROGRESS_DELAY: 1000,
  PROGRESS_STEPS: 10,
  BIG_BANG_CHUNK: 40,
  BIG_BANG_FRAME_DELAY: 1000,
  RUN_DELAY: 700,
}

export enum TermControls {
  CLEAR_SCREEN = '\x1b[2J\x1b[H',
  SAVE_CURSOR = '\x1b[s',
  RESTORE_CURSOR = '\x1b[u',
  UP_LINE = '\x1b[A',
  CLEAR_LINE = '\r\x1b[K',
  COLOR_START = '\x1b',
  COLOR_END = 'm',
  NEW_LINE = '\n',
  CARRIAGE_RETURN = '\r',
  TAB = '\t',
}

export const CONTROL_TEST = /[\s\x1b.:,\-+—_![\]()\u2026]/;
export const LINE_END_TEST = /[\r\n](?!\x1b)/;
