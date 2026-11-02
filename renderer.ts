import { SoulInstance } from "./humanSoul";
import dictionary from "./dictionary.json";

export enum Colors {
  yellow = '\x1b[93m',
  blue = '\x1b[34m',
  purple = '\x1b[35m',
  gray = '\x1b[90m',
  sage = '\x1b[38;5;108m',
  coral = '\x1b[38;5;203m',
  emerald = '\x1b[38;5;35m',
  terracotta = '\x1b[38;5;172m',
  steel = '\x1b[38;5;110m',
  denim = '\x1b[38;5;68m',
  amethyst = '\x1b[38;5;139m',
  white = '\x1b[97m',
  clear = '\x1b[0m',
}

export class Renderer {
  private static readonly BIG_BANG_FRAMES = [
    `${Colors.clear}${dictionary['big_bang.point']}${Colors.clear}`,
    `${Colors.yellow}${dictionary['big_bang.heat']}${Colors.clear}`,
    `${Colors.purple}${dictionary['big_bang.flash']}${Colors.clear}`,
    `${Colors.blue}${dictionary['big_bang.matter']}${Colors.clear}`,
    `${Colors.steel}${dictionary['big_bang.galaxy']}${Colors.clear}`
  ];
  private static readonly SPINNER_FRAMES = dictionary["spinner"].slice();
  private static readonly PROGRESS_EMPTY = dictionary["progress.empty"];
  private static readonly PROGRESS_FILLED = dictionary["progress.filled"];
  private static readonly PROGRESS_WIDTH = 20;

  public static get bigBangStages(): number {
    return Renderer.BIG_BANG_FRAMES.length;
  }

  private static message (message: string, params: { color?: Colors, start?: boolean, end?: boolean } = {}): string  {
    const defaults = {color: Colors.yellow, start: true, end: false};
    const props = Object.assign({}, defaults, params);

    return `${props.start ? '\n' : ''}${props.color}${message}${Colors.clear}${props.end ? '\n' : ''}`;
  }

  private static trustLevel (hero: SoulInstance, up: boolean = true): string {
    const trustLevelPercent = (hero.trustLevel * 100).toFixed(0);

    if (!hero.partner) {
      return `${dictionary["heroes.trust"]}${hero.name}${dictionary["heroes.trust.level"]}**${trustLevelPercent}%**`;
    }
    return `${dictionary["heroes.trust"]}${hero.name}${dictionary["heroes.trust.to"]}${hero.partner.name} ${up ? dictionary['heroes.trust.up'] : dictionary['heroes.trust.down']}${dictionary['heroes.trust.by']}**${trustLevelPercent}%**`;
  }

  private static bindLabel (hero: SoulInstance): string {
    if (!hero.partner) {
      return `${hero.name}${dictionary['heroes.bind.loner']}`;
    }
    return `${hero.name}${dictionary['heroes.bind.link']}${hero.partner.name}`
  }

  public static header (message: string): string {
    return Renderer.message(message, { end: true });
  }

  public static objectHeader (properties: string): string {
    return Renderer.message(properties, { color: Colors.steel, start: false } );
  };

  public static properties (properties: string): string {
    return Renderer.message(properties, { color: Colors.gray, end: true } );
  };

  public static blockLabel (label: string, footer: boolean = false): string {
    return Renderer.message(label, { color: Colors.gray, start: !footer });
  }

  public static acquaintance (hero: SoulInstance): string {
    return Renderer.message(`${dictionary['heroes.bind.partner']}${Renderer.bindLabel(hero)}`, { color: Colors.amethyst, end: true });
  }

  public static efficiency (hero: SoulInstance): string {
    return Renderer.message(`${Renderer.bindLabel(hero)}`, { color: Colors.sage, start: false });
  }

  public static levelUpTrust(hero: SoulInstance): string {
    return Renderer.message(`${dictionary['heroes.trust.level.up']}${Renderer.trustLevel(hero)}`, { color: Colors.sage, start: false });
  }

  public static levelDownTrust (hero: SoulInstance): string {
    return Renderer.message(`${dictionary['heroes.trust.level.down']}${Renderer.trustLevel(hero, false)}`, { color: Colors.denim, start: false });
  }

  public static success (message: string): string {
    return Renderer.message(message, { color: Colors.emerald,  start: false, end: false});
  }

  public static error (message: string): string {
    return Renderer.message(message, { color: Colors.coral,  start: false, end: false});
  }

  public static warning (message: string): string {
    return Renderer.message(message, { color: Colors.terracotta,  start: false, end: false});
  }

  public static spinner(step: number, status: string): string {
    const frame = Renderer.SPINNER_FRAMES[step % Renderer.SPINNER_FRAMES.length];

    return `${Colors.blue}${frame}${Colors.clear} ${status}${Colors.clear}`;
  }

  public static progress(progress: number, status: string): string {
    const completedWidth = Math.round(Renderer.PROGRESS_WIDTH * Math.min(Math.max(progress, 0), 1));
    const remainingWidth = Renderer.PROGRESS_WIDTH - completedWidth;

    const bar = Renderer.PROGRESS_FILLED.repeat(completedWidth) + Renderer.PROGRESS_EMPTY.repeat(remainingWidth);
    const percent = (progress * 100).toFixed(0);

    return `${Colors.gray}[${bar}] ${percent}%${Colors.clear} | ${Colors.gray}${status}${Colors.clear}`;
  }

  public static bigBangFrame(stage: number): string {
    return Renderer.BIG_BANG_FRAMES[Math.min(stage, Renderer.bigBangStages - 1)];
  }

  public static highlight(text: string): string {
    const color: string = Colors.white;
    let result: string = '';
    let currentBaseColor: string = Colors.clear;
    let isInside = false;
    
    let i = 0;
    while (i < text.length) {
      if (text[i] === '\x1b') {
        const closingIndex = text.indexOf('m', i);
        if (closingIndex !== -1) {
          const ansiCode = text.substring(i, closingIndex + 1);
          if (ansiCode !== Colors.clear) {
            currentBaseColor = ansiCode;
          }
          result += ansiCode;
          i = closingIndex + 1;
          continue;
        }
      }

      if (text.substring(i, i + 2) === '**') {
        if (!isInside) {
          result += color === currentBaseColor || currentBaseColor === Colors.clear ? Colors.steel : color;
          isInside = true;
        } else {
          result += currentBaseColor;
          isInside = false;
        }
        i += 2;
        continue;
      }

      const codePoint = text.codePointAt(i);
      if (codePoint === undefined) break;
      const char = String.fromCodePoint(codePoint);
      
      result += char;
      i += char.length;
    }

    return result;
  }

}
