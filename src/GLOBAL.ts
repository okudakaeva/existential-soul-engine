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
  CLEAR_SCREEN = '\x1b[2J\x1b[H',  // Полная очистка холста и сброс в 0,0
  SAVE_CURSOR  = '\x1b[s',         // Сохранить позицию и цвет каретки
  RESTORE_CURSOR = '\x1b[u',       // Восстановить позицию и цвет каретки
  UP_LINE      = '\x1b[A',         // Сдвиг каретки на 1 строку вверх
  CLEAR_LINE   = '\r\x1b[K',       // Возврат в начало и полное выжигание строки
  COLOR_START = '\x1b',
  COLOR_END = 'm',
  NEW_LINE = '\n',
  CARRIAGE_RETURN = '\r',
  TAB = '\t',
  SPACE = '\s',
}
