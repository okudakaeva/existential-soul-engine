export interface TerminalKeyEvent {
  key: string;
  ctrl?: boolean;
  isSpace?: boolean;
}

export interface ITerminalAdapter {
  write (data: string): void;

  onKey (callback: (event: TerminalKeyEvent) => void): void;

  dispose? (): void;
}
