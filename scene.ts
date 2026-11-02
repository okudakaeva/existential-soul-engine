import { SoulInstance } from "./humanSoul";
import { Renderer } from "./renderer";
import dictionary from "./dictionary.json";

export class Scene {
  private static readonly LETTER_DELAY_MULTIPLIER = 2;
  private static readonly FINAL_PAUSE_STEPS = 4;

  private static async renderTypewriter(text: string, useSpinner: boolean, delayMs: number = 50): Promise<void> {
    let currentText = '';
    let step = 0;

    let i = 0;
    while (i < text.length) {
      if (text[i] === '\x1b') {
        const closingIndex = text.indexOf('m', i);
        if (closingIndex !== -1) {
          const ansiCode = text.substring(i, closingIndex + 1);
          currentText += ansiCode;
          if (!useSpinner) process.stdout.write(ansiCode);
          i = closingIndex + 1;
          continue;
        }
      }

      const codePoint = text.codePointAt(i);
      if (codePoint === undefined) break;
      
      const char = String.fromCodePoint(codePoint);
      currentText += char;

      if (useSpinner) {
        const output = Renderer.spinner(step++, currentText);
        process.stdout.write(`\r\x1b[K${output}`);
      } else {
        process.stdout.write(char);
      }

      const charLength = char.length;
      i += charLength;

      if (char !== '\n') {
        const currentDelay = char !== ' ' ? delayMs * Scene.LETTER_DELAY_MULTIPLIER : delayMs;
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    if (useSpinner) {
      for (let p = 0; p < Scene.FINAL_PAUSE_STEPS; p++) {
        const output = Renderer.spinner(step++, currentText);
        process.stdout.write(`\r\x1b[K${output}`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, delayMs * Scene.FINAL_PAUSE_STEPS));
    }

    Scene.break();
  }

  private static soulCard(header: string, hero: SoulInstance, dynamicOnly: boolean = true): void {
    const locBool = (val: boolean | undefined) => 
      val === undefined ? dictionary["card.boolean.undefined"] : 
      (val ? dictionary["card.boolean.true"] : dictionary["card.boolean.false"]);

    const policyLabel = !!hero.personalPolicy
      ? dictionary["card.policy.conformist"] 
      : dictionary["card.policy.rebel"];

    const radicalLabel = !!hero.radicalist 
      ? dictionary["card.radical.radical"] 
      : dictionary["card.radical.compromiser"];

    const mindsetLabel = hero.isVisionary 
      ? dictionary["card.mindset.visionary"] 
      : dictionary["card.mindset.pragmatist"];

    let bigotLabel = dictionary["card.bigot.undefined"];
    
    if (hero.bigot !== undefined) {
      if (hero.bigot === 0) bigotLabel = dictionary["card.bigot.atheist"];
      if (hero.bigot === 1) bigotLabel = dictionary["card.bigot.fanatic"];
      if (hero.bigot === 2) bigotLabel = dictionary["card.bigot.agnostic"];
    }
    if (!!hero.radicalist) bigotLabel += dictionary["card.bigot.radical"];

    const staticProps = [
      dictionary['card.constant'],
      `${dictionary['card.policy.label']}${policyLabel};`,
      `${dictionary['card.radical.label']}${radicalLabel};`,
      `${dictionary['card.mindset.label']}${mindsetLabel};`, 
      `${dictionary['card.bigot.label']}${bigotLabel};`,
      dictionary['card.dynamic'],
    ]
    const props = [
      ...(dynamicOnly ? [] : staticProps),
      `${dictionary['card.trust.label']}${(hero.trustLevel * 100).toFixed(0)}%;`,
      `${dictionary['card.stable.label']}${locBool(hero.isStabilized)};`,
      `${dictionary['card.ideas.label']}${locBool(hero.embeddedIdeasGenerator)};`,
      `${dictionary['card.believe.label']}${locBool(hero.hasWantToBelieve)};`,
      `${dictionary['card.seeker.label']}${locBool(hero.theTruthIsOutThere)};`,
      `${dictionary['card.truth.label']}${locBool(hero.hasRightsToTruth)};`,
      `${dictionary['card.love.label']}${locBool(hero.getIsExistLove())};`,
      `${dictionary['card.god.label']}${locBool(hero.getIsExistGod())};`
    ];

    Scene.object(header, ` ${props.join('\n ')}`);
  }

  public static highlight(message: string) {
    return Renderer.highlight(message);
  }

  public static text(message: string, ...rest: any[]): void {
    console.log(Renderer.highlight(message), ...rest);
  }

  public static async type(text: string, delayMs: number = 50): Promise<void> {
    await Scene.renderTypewriter(Renderer.highlight(text), false, delayMs);
  }

  public static async spinAndType(status: string, delayMs: number = 50): Promise<void> {
    await Scene.renderTypewriter(status, true, delayMs);
  }

  public static header(message: string): void {
    Scene.text(Renderer.header(message));
  }

  public static object(header: string, properties: string): void {
    Scene.text(`${Renderer.objectHeader(header)}:${Renderer.properties(properties)}`);
  }

  public static blockHeader(header: string): void {
    Scene.text(Renderer.blockLabel(header));
  }

  public static async blockFooter(footer: string, useTypewriter: boolean = false): Promise<void> {
    const rendered = Renderer.blockLabel(footer, true);

    if (useTypewriter) {
      await Scene.type(rendered);
    } else {
      Scene.text(rendered);
    }
  }

  public static async card (header: string, hero: SoulInstance, dynamicOnly: boolean = true): Promise<void> {
    await Scene.progress(dictionary['heroes.soul.matrix'], 500);
    Scene.soulCard(header, hero, dynamicOnly);
  }

  public static acquaintance (hero1: SoulInstance, hero2: SoulInstance): void {
    hero1.acquaintance(hero2);
    Scene.text(Renderer.levelUpTrust(hero1));
    Scene.text(Renderer.levelUpTrust(hero2));
    Scene.text(Renderer.acquaintance(hero1));
  }

  public static levelUpTrust (hero: SoulInstance, value: number): void {
    hero.levelUpTrust(value);
    Scene.text(Renderer.levelUpTrust(hero));
  }

  public static levelDownTrust (hero: SoulInstance, value: number): void {
    hero.levelDownTrust(value);
    Scene.text(Renderer.levelDownTrust(hero));
  }

  public static efficiency (hero: SoulInstance): void {
    Scene.text(`${Renderer.efficiency(hero)}: `, [hero.getTeamEfficiency()]);
  }

  public static async changeTrustLevel (hero: SoulInstance, value: number, up: boolean = true): Promise<void> {
    if (up) {
      Scene.levelUpTrust(hero, value);
    } else {
      Scene.levelDownTrust(hero, value);
    }
    await Scene.progress(dictionary['heroes.soul.matrix'], 500);
    Scene.soulCard(hero.partner!.name, hero.partner!);
    Scene.soulCard(hero.name, hero);
  }

  public static async success (message: string): Promise<void> {
    await Scene.type(Renderer.success(message));
  }

  public static async error (message: string): Promise<void> {
    await Scene.type(Renderer.error(message));
  }

  public static async warning (message: string): Promise<void> {
    await Scene.type(Renderer.warning(message));
  }

  public static async progress(status: string, durationMs: number = 1000, steps: number = 10): Promise<void> {
    for (let i = 0; i <= steps; i++) {
      process.stdout.write(`\r${Renderer.progress(i / steps, status)}`);
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, durationMs / steps));
      }
    }

    Scene.break();
  }

  public static async bigBang(message: string): Promise<void> {
    const START_DELAY = 450;
    const DECELERATION_STEP = 150;
    const BANG_FLASH_HOLD = 150;

    for (let stage = 0; stage < Renderer.bigBangStages; stage++) {
      const frame = Renderer.bigBangFrame(stage);
      process.stdout.write(`\r\x1b[K\t${frame}`);
      
      await new Promise(resolve => setTimeout(resolve, START_DELAY + (stage * DECELERATION_STEP)));
    }

    await new Promise(resolve => setTimeout(resolve, Renderer.bigBangStages * BANG_FLASH_HOLD));
    await Scene.type(`\r\x1b[K${message}`);
  }

  public static async delay(timeout: number = 700): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, timeout));
  }

  public static break(): void {
    Scene.text('');
  }
}
