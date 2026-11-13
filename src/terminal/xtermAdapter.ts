import { Terminal } from '@xterm/xterm';
import { ITerminalAdapter, TerminalKeyEvent } from './terminalPort.ts';

export class XtermAdapter implements ITerminalAdapter {
  private readonly term: Terminal;

  constructor (term: Terminal) {
    this.term = term;
  }

  public write (data: string): void {
    this.term.write(data);
  }

  public onKey (callback: (event: TerminalKeyEvent) => void): void {
    this.term.onKey(({ key, domEvent }) => {
      if (domEvent.code === 'Space') {
        domEvent.preventDefault();
      }

      callback({
        key: domEvent.key || key,
        ctrl: domEvent.ctrlKey,
        isSpace: domEvent.code === 'Space',
      });
    });
  }

  public dispose (): void {}
}
