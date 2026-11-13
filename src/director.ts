import { CONTROL_TEST, GLOBAL, LINE_END_TEST, TermControls } from './GLOBAL.ts';
import { ITerminalAdapter } from './terminal/terminalPort.ts';

export class Director {
  private static adapter: ITerminalAdapter | null = null;
  private static isPaused = false;
  private static isRunning = true;
  private static isSkipping = false;
  private static isFastForward = false;
  private static readonly LETTER_DELAY_MULTIPLIER = 2;
  private static readonly FINAL_PAUSE_STEPS = 4;
  private static readonly PAUSE_DELAY = 100;

  public static setAdapter (adapter: ITerminalAdapter): void {
    Director.adapter = adapter;
  }

  public static write (data: string): void {
    Director.adapter?.write(data);
  }

  public static startHeaderSkip (): void {
    Director.isSkipping = true;
  }

  public static stopHeaderSkip (): void {
    Director.isSkipping = false;
  }

  public static get shouldFastForward (): boolean {
    return Director.isFastForward || Director.isSkipping;
  }

  public static async execute (
      generator: Generator<string, void, unknown>,
      delayMs: number = GLOBAL.CHUNK
  ): Promise<void> {
    let item = generator.next();

    while (!item.done && Director.isRunning) {
      if (Director.isPaused) {
        await Director.executeDelay(Director.PAUSE_DELAY);
        continue;
      }

      const frame = item.value;
      Director.write(frame);

      const isAnsiOnly = frame.startsWith(TermControls.COLOR_START) && frame.endsWith(TermControls.COLOR_END);

      if (!isAnsiOnly && frame !== '' && !Director.shouldFastForward) {
        let currentDelay = delayMs;
        const isControl = CONTROL_TEST.test(frame);
        const isLineEnd = LINE_END_TEST.test(frame);
        if (!isControl || frame.startsWith(TermControls.CLEAR_LINE)) {
          currentDelay = delayMs * Director.LETTER_DELAY_MULTIPLIER;
        } else if (isLineEnd) {
          currentDelay = delayMs * Director.FINAL_PAUSE_STEPS;
        }
        await Director.executeDelay(currentDelay);
      }

      item = generator.next();
    }

    if (!Director.shouldFastForward) {
      await Director.executeDelay(delayMs * Director.FINAL_PAUSE_STEPS);
    }
  }

  public static async executeProgress (
      generator: Generator<string, void>,
      durationMs: number = GLOBAL.PROGRESS_DELAY,
      steps: number = GLOBAL.PROGRESS_STEPS
  ): Promise<void> {
    let item = generator.next();

    while (!item.done && Director.isRunning) {
      if (Director.isPaused) {
        await Director.executeDelay(Director.PAUSE_DELAY);
        continue;
      }

      Director.write(item.value);

      if (!Director.shouldFastForward) {
        await Director.executeDelay(durationMs / steps);
      }

      item = generator.next();
    }
  }

  public static async executeBigBang (
      bangGen: Generator<string, void>,
      labelGenerator: Generator<Generator<string, void>, void>,
  ): Promise<void> {
    let bangItem = bangGen.next();
    let labelItem = labelGenerator.next();

    Director.write(`${ TermControls.NEW_LINE.repeat(2) }`);

    while (!bangItem.done && !labelItem.done && Director.isRunning) {
      if (Director.isPaused) {
        await Director.executeDelay(Director.PAUSE_DELAY);
        continue;
      }

      Director.write(
          `${ TermControls.UP_LINE.repeat(2) }${ TermControls.CLEAR_LINE }` +
          bangItem.value + TermControls.NEW_LINE.repeat(2)
      );

      await Director.execute(labelItem.value, GLOBAL.BIG_BANG_CHUNK);

      if (!Director.shouldFastForward) {
        await Director.executeDelay(GLOBAL.BIG_BANG_FRAME_DELAY);
      }

      bangItem = bangGen.next();
      labelItem = labelGenerator.next();
    }
  }

  public static async executeDelay (timeoutMs: number = GLOBAL.RUN_DELAY): Promise<void> {
    if (Director.shouldFastForward) {
      return;
    }

    let remaining = timeoutMs;

    while (remaining > 0 && Director.isRunning) {
      if (Director.isPaused) {
        await new Promise(resolve => setTimeout(resolve, Director.PAUSE_DELAY));
        continue;
      }

      const currentChunk = Math.min(remaining, GLOBAL.CHUNK);
      await new Promise(resolve => setTimeout(resolve, currentChunk));

      remaining -= currentChunk;
    }
  }

  public static initKeyboard (): void {
    Director.adapter?.onKey(({ key, ctrl, isSpace }) => {
      const lowerKey = key.toLowerCase();

      if (ctrl && (lowerKey === 'c' || lowerKey === 'с')) {
        Director.isRunning = false;
        Director.write('\n^C [TERMINATED]\n');
      }

      if (isSpace) {
        Director.isPaused = !Director.isPaused;
        Director.write(Director.isPaused ? TermControls.SAVE_CURSOR : TermControls.RESTORE_CURSOR);
      }

      if (lowerKey === 'f' || lowerKey === 'а') {
        Director.isFastForward = !Director.isFastForward;
      }

      if (lowerKey === 'n' || lowerKey === 'т') {
        Director.startHeaderSkip();
      }
    });
  }

  public static release (): void {
    Director.isRunning = false;
    Director.adapter?.dispose?.();
  }

  public static clearScreen (): void {
    Director.write(TermControls.CLEAR_SCREEN);
  }
}
