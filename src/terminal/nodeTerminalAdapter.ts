import readline from 'readline';
import { ITerminalAdapter, TerminalKeyEvent } from './terminalPort.ts';

export class NodeTerminalAdapter implements ITerminalAdapter {
  public write (data: string): void {
    process.stdout.write(data);
  }

  public onKey (callback: (event: TerminalKeyEvent) => void): void {
    readline.emitKeypressEvents(process.stdin as unknown as NodeJS.ReadableStream);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    process.stdin.on('keypress', (str, key) => {
      callback({
        key: str || key?.name || '',
        ctrl: Boolean(key?.ctrl),
        isSpace: key?.name === 'space',
      });
    });
  }

  public dispose (): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }
}
