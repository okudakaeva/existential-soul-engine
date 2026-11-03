import dictionary from './dictionary.json';
import { TermControls } from './GLOBAL';
import { SoulInstance } from './humanSoul';

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
  champagne = '\x1b[38;5;223m',
  banana = '\x1b[38;5;221m',
  clear = '\x1b[0m',
}

export class Renderer {
  private static readonly BIG_BANG_FRAMES = [
    `${ Colors.champagne }${ dictionary['big_bang.point'] }${ Colors.clear }`,
    `${ Colors.yellow }${ dictionary['big_bang.heat'] }${ Colors.clear }`,
    `${ Colors.purple }${ dictionary['big_bang.flash'] }${ Colors.clear }`,
    `${ Colors.blue }${ dictionary['big_bang.matter'] }${ Colors.clear }`,
    `${ Colors.steel }${ dictionary['big_bang.galaxy'] }${ Colors.clear }`
  ];
  private static readonly BIG_BANG_LABELS = [
    `${ Colors.champagne }${ dictionary['big_bang.point.text'] }${ Colors.clear }`,
    `${ Colors.banana }${ dictionary['big_bang.heat.text'] }${ Colors.clear }`,
    `${ Colors.amethyst }${ dictionary['big_bang.flash.text'] }${ Colors.clear }`,
    `${ Colors.denim }${ dictionary['big_bang.matter.text'] }${ Colors.clear }`,
    `${ Colors.steel }${ dictionary['big_bang.galaxy.text'] }${ Colors.clear }`,
  ];
  private static readonly SPINNER_FRAMES = dictionary['spinner'].slice();
  private static readonly PROGRESS_EMPTY = dictionary['progress.empty'];
  private static readonly PROGRESS_FILLED = dictionary['progress.filled'];
  private static readonly PROGRESS_WIDTH = 20;

  private static message (
      message: string,
      params: { color?: Colors, start?: boolean, end?: boolean } = {}
  ): string {
    const defaults = { color: Colors.yellow, start: true, end: false };
    const props = Object.assign({}, defaults, params);
    const start = props.start ? TermControls.NEW_LINE : '';
    const end = props.end ? TermControls.NEW_LINE : '';

    return `${ start }${ props.color }${ message }${ Colors.clear }${ end }`;
  }

  private static trustLevel (hero: SoulInstance, up: boolean = true): string {
    const trustLevelPercent = (hero.trustLevel * 100).toFixed(0);

    if (!hero.partner) {
      return [
        `${ dictionary['heroes.trust'] }${ hero.name }`,
        `${ dictionary['heroes.trust.level'] }**${ trustLevelPercent }%**`,
      ].join('');
    }
    return [
      `${ dictionary['heroes.trust'] }${ hero.name }`,
      `${ dictionary['heroes.trust.to'] }${ hero.partner.name } `,
      `${ up ? dictionary['heroes.trust.up'] : dictionary['heroes.trust.down'] }`,
      `${ dictionary['heroes.trust.by'] }**${ trustLevelPercent }%**`,
    ].join('');
  }

  private static bindLabel (hero: SoulInstance): string {
    if (!hero.partner) {
      return `${ hero.name }${ dictionary['heroes.bind.loner'] }`;
    }
    return `${ hero.name }${ dictionary['heroes.bind.link'] }${ hero.partner.name }`
  }

  private static spinner (step: number, status: string): string {
    const frame = Renderer.SPINNER_FRAMES[step % Renderer.SPINNER_FRAMES.length];

    return `${ TermControls.CLEAR_LINE }${ Colors.blue }${ frame }${ Colors.clear } ${ status }${ Colors.clear }`;
  }

  private static progress (progress: number, status: string): string {
    const completedWidth = Math.round(Renderer.PROGRESS_WIDTH * Math.min(Math.max(progress, 0), 1));
    const remainingWidth = Renderer.PROGRESS_WIDTH - completedWidth;

    const bar = Renderer.PROGRESS_FILLED.repeat(completedWidth) + Renderer.PROGRESS_EMPTY.repeat(remainingWidth);
    const percent = (progress * 100).toFixed(0);

    return [
      `${ TermControls.CARRIAGE_RETURN }${ Colors.gray }`,
      `[${ bar }] ${ percent }%${ Colors.clear } | `,
      `${ Colors.gray }${ status }${ Colors.clear }`,
    ].join('');
  }

  public static* generateTypewriter (text: string, useSpinner: boolean = false): Generator<string, void> {
    let currentText = '';
    let step = 0;
    let i = 0;

    while (i < text.length) {
      if (text[i] === TermControls.COLOR_START) {
        const closingIndex = text.indexOf(TermControls.COLOR_END, i);
        if (closingIndex !== -1) {
          const ansiCode = text.substring(i, closingIndex + 1);
          currentText += ansiCode;
          i = closingIndex + 1;
          yield ansiCode;
          continue;
        }
      }

      const codePoint = text.codePointAt(i);
      if (codePoint === undefined) break;

      const char = String.fromCodePoint(codePoint);
      currentText += char;

      i += codePoint > 0xffff ? 2 : 1;

      if (useSpinner) {
        yield Renderer.spinner(step++, currentText);
      } else {
        yield char;
      }
    }
  }

  public static* generateProgress (
      status: string,
      steps: number,
  ): Generator<string, void> {
    for (let i = 0; i <= steps; i++) {
      yield Renderer.progress(i / steps, status);
    }
  }

  public static* generateBigBang (): Generator<string, void> {
    for (let stage = 0; stage < Renderer.BIG_BANG_FRAMES.length; stage++) {
      yield `${ TermControls.CLEAR_LINE }${ TermControls.TAB.repeat(2) }${ Renderer.BIG_BANG_FRAMES[stage] }`;
    }
  }

  public static* generateBigBangLabel (): Generator<Generator<string, void>, void> {
    for (let stage = 0; stage < Renderer.BIG_BANG_LABELS.length; stage++) {
      yield Renderer.generateTypewriter(Renderer.highlight(`${ TermControls.CLEAR_LINE }${ Renderer.BIG_BANG_LABELS[stage] }`));
    }
  }

  public static header (message: string): string {
    return Renderer.message(message, { end: true });
  }

  public static objectHeader (properties: string): string {
    return Renderer.message(properties, { color: Colors.steel, start: false });
  };

  public static properties (properties: string): string {
    return Renderer.message(properties, { color: Colors.gray, end: true });
  };

  public static blockLabel (label: string, footer: boolean = false): string {
    return Renderer.message(label, { color: Colors.gray, start: !footer });
  }

  public static acquaintance (hero: SoulInstance): string {
    return Renderer.message(
        `${ dictionary['heroes.bind.partner'] }${ Renderer.bindLabel(hero) }`,
        { color: Colors.amethyst, end: true }
    );
  }

  public static efficiency (hero: SoulInstance): string {
    return Renderer.message(
        `${ Renderer.bindLabel(hero) }: `,
        { color: Colors.sage, start: false }
    );
  }

  public static levelUpTrust (hero: SoulInstance): string {
    return Renderer.message(
        `${ dictionary['heroes.trust.level.up'] }${ Renderer.trustLevel(hero) }`,
        { color: Colors.sage, start: false }
    );
  }

  public static levelDownTrust (hero: SoulInstance): string {
    return Renderer.message(
        `${ dictionary['heroes.trust.level.down'] }${ Renderer.trustLevel(hero, false) }`,
        { color: Colors.denim, start: false }
    );
  }

  public static success (message: string): string {
    return Renderer.message(message, { color: Colors.emerald, start: false, end: false });
  }

  public static error (message: string): string {
    return Renderer.message(message, { color: Colors.coral, start: false, end: false });
  }

  public static warning (message: string): string {
    return Renderer.message(message, { color: Colors.terracotta, start: false, end: false });
  }

  public static highlight (text: string): string {
    const color: string = Colors.white;
    let result: string = '';
    let currentBaseColor: string = Colors.clear;
    let isInside = false;

    let i = 0;
    while (i < text.length) {
      if (text[i] === TermControls.COLOR_START) {
        const closingIndex = text.indexOf(TermControls.COLOR_END, i);
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

  public static card (hero: SoulInstance, dynamicOnly: boolean = true): string {
    const locBool = (val: boolean | undefined) =>
        val === undefined ? dictionary['card.boolean.undefined'] :
            (val ? dictionary['card.boolean.true'] : dictionary['card.boolean.false']);

    const policyLabel = !!hero.personalPolicy
        ? dictionary['card.policy.conformist']
        : dictionary['card.policy.rebel'];

    const radicalLabel = !!hero.radicalist
        ? dictionary['card.radical.radical']
        : dictionary['card.radical.compromiser'];

    const mindsetLabel = hero.isVisionary
        ? dictionary['card.mindset.visionary']
        : dictionary['card.mindset.pragmatist'];

    let bigotLabel = dictionary['card.bigot.undefined'];

    if (hero.bigot !== undefined) {
      if (hero.bigot === 0) bigotLabel = dictionary['card.bigot.atheist'];
      if (hero.bigot === 1) bigotLabel = dictionary['card.bigot.fanatic'];
      if (hero.bigot === 2) bigotLabel = dictionary['card.bigot.agnostic'];
    }
    if (!!hero.radicalist) bigotLabel += dictionary['card.bigot.radical'];

    const staticProps = [
      dictionary['card.constant'],
      `${ dictionary['card.policy.label'] }${ policyLabel };`,
      `${ dictionary['card.radical.label'] }${ radicalLabel };`,
      `${ dictionary['card.mindset.label'] }${ mindsetLabel };`,
      `${ dictionary['card.bigot.label'] }${ bigotLabel };`,
      dictionary['card.dynamic'],
    ]
    const props = [
      ...(dynamicOnly ? [] : staticProps),
      `${ dictionary['card.trust.label'] }${ (hero.trustLevel * 100).toFixed(0) }%;`,
      `${ dictionary['card.stable.label'] }${ locBool(hero.isStabilized) };`,
      `${ dictionary['card.ideas.label'] }${ locBool(hero.embeddedIdeasGenerator) };`,
      `${ dictionary['card.believe.label'] }${ locBool(hero.hasWantToBelieve) };`,
      `${ dictionary['card.seeker.label'] }${ locBool(hero.theTruthIsOutThere) };`,
      `${ dictionary['card.truth.label'] }${ locBool(hero.hasRightsToTruth) };`,
      `${ dictionary['card.love.label'] }${ locBool(hero.getIsExistLove()) };`,
      `${ dictionary['card.god.label'] }${ locBool(hero.getIsExistGod()) };`
    ];

    return props.join(`${ TermControls.NEW_LINE }`);
  }
}
