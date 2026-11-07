import { CONTROL_TEST, GLOBAL, LINE_END_TEST, TermControls } from './GLOBAL';
import readline from 'readline';

export class Director {
  private static isPaused = false;
  private static isRunning = true;
  private static readonly LETTER_DELAY_MULTIPLIER = 2;
  private static readonly FINAL_PAUSE_STEPS = 4;
  private static readonly PAUSE_DELAY = 100;

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

      process.stdout.write(frame);

      const isAnsiOnly = frame.startsWith(TermControls.COLOR_START) && frame.endsWith(TermControls.COLOR_END);

      if (!isAnsiOnly && frame !== '') {
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

    await Director.executeDelay(delayMs * Director.FINAL_PAUSE_STEPS);
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

      process.stdout.write(item.value);
      await Director.executeDelay(durationMs / steps);

      item = generator.next();
    }
  }

  public static async executeBigBang (
      bangGen: Generator<string, void>,
      labelGenerator: Generator<Generator<string, void>, void>,
  ): Promise<void> {
    let bangItem = bangGen.next();
    let labelItem = labelGenerator.next();

    process.stdout.write(`${ TermControls.NEW_LINE.repeat(2) }`);

    while (!bangItem.done && !labelItem.done && Director.isRunning) {
      if (Director.isPaused) {
        await Director.executeDelay(Director.PAUSE_DELAY);
        continue;
      }

      process.stdout.write(
          `${ TermControls.UP_LINE.repeat(2) }${ TermControls.CLEAR_LINE }` +
          bangItem.value + TermControls.NEW_LINE.repeat(2)
      );

      await Director.execute(labelItem.value, GLOBAL.BIG_BANG_CHUNK);
      await Director.executeDelay(GLOBAL.BIG_BANG_FRAME_DELAY);

      bangItem = bangGen.next();
      labelItem = labelGenerator.next();
    }
  }

  public static async executeDelay (timeoutMs: number = GLOBAL.RUN_DELAY): Promise<void> {
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
    readline.emitKeypressEvents(process.stdin as unknown as NodeJS.ReadableStream);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') process.exit();

      if (key.name === 'space') {
        Director.isPaused = !Director.isPaused;

        if (Director.isPaused) {
          process.stdout.write(TermControls.SAVE_CURSOR);
        } else {
          process.stdout.write(TermControls.RESTORE_CURSOR);
        }
      }
    });
  }

  public static release (): void {
    Director.isRunning = false;
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }

  public static clearScreen (): void {
    process.stdout.write(TermControls.CLEAR_SCREEN);
  }
}
