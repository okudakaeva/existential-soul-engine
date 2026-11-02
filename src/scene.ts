import dictionary from './dictionary.json';
import { GLOBAL, TermControls } from './GLOBAL';
import { SoulInstance } from './humanSoul';
import { Renderer } from './renderer';
import { Director } from './director';

export class Scene {
  private static soulCard (header: string, hero: SoulInstance, dynamicOnly: boolean = true): void {
    const locBool = (val: boolean | undefined) =>
        val === undefined ? dictionary['card.boolean.undefined']:
            (val ? dictionary['card.boolean.true']:dictionary['card.boolean.false']);

    const policyLabel = !!hero.personalPolicy
        ? dictionary['card.policy.conformist']
        :dictionary['card.policy.rebel'];

    const radicalLabel = !!hero.radicalist
        ? dictionary['card.radical.radical']
        :dictionary['card.radical.compromiser'];

    const mindsetLabel = hero.isVisionary
        ? dictionary['card.mindset.visionary']
        :dictionary['card.mindset.pragmatist'];

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
      ...(dynamicOnly ? []:staticProps),
      `${ dictionary['card.trust.label'] }${ (hero.trustLevel * 100).toFixed(0) }%;`,
      `${ dictionary['card.stable.label'] }${ locBool(hero.isStabilized) };`,
      `${ dictionary['card.ideas.label'] }${ locBool(hero.embeddedIdeasGenerator) };`,
      `${ dictionary['card.believe.label'] }${ locBool(hero.hasWantToBelieve) };`,
      `${ dictionary['card.seeker.label'] }${ locBool(hero.theTruthIsOutThere) };`,
      `${ dictionary['card.truth.label'] }${ locBool(hero.hasRightsToTruth) };`,
      `${ dictionary['card.love.label'] }${ locBool(hero.getIsExistLove()) };`,
      `${ dictionary['card.god.label'] }${ locBool(hero.getIsExistGod()) };`
    ];

    Scene.object(header, ` ${ props.join(`${TermControls.NEW_LINE} `) }`);
  }

  public static highlight (message: string) {
    return Renderer.highlight(message);
  }

  public static text (message: string, ...rest: any[]): void {
    console.log(Renderer.highlight(message), ...rest);
  }

  public static async type (text: string, delayMs: number = GLOBAL.CHUNK): Promise<void> {
    const generator = Renderer.generateTypewriter(Renderer.highlight(text));
    await Director.execute(generator, delayMs);
    Scene.break();
  }

  public static async spinAndType (status: string, delayMs: number = GLOBAL.CHUNK): Promise<void> {
    const generator = Renderer.generateTypewriter(Renderer.highlight(status), true);
    await Director.execute(generator, delayMs);
    Scene.break();
  }

  public static header (message: string): void {
    Scene.text(Renderer.header(message));
  }

  public static object (header: string, properties: string): void {
    Scene.text(`${ Renderer.objectHeader(header) }:${ Renderer.properties(properties) }`);
  }

  public static blockHeader (header: string): void {
    Scene.text(Renderer.blockLabel(header));
  }

  public static async blockFooter (footer: string, useTypewriter: boolean = false): Promise<void> {
    const rendered = Renderer.blockLabel(footer, true);

    if (useTypewriter) {
      await Scene.type(rendered);
    } else {
      Scene.text(rendered);
    }
  }

  public static async card (header: string, hero: SoulInstance, dynamicOnly: boolean = true): Promise<void> {
    await Scene.progress(dictionary['heroes.soul.matrix'], GLOBAL.MATRIX_READ);
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
    Scene.text(`${ Renderer.efficiency(hero) }: `, [hero.getTeamEfficiency()]);
  }

  public static async changeTrustLevel (
      hero: SoulInstance,
      value: number,
      up: boolean = true
  ): Promise<void> {
    if (up) {
      Scene.levelUpTrust(hero, value);
    } else {
      Scene.levelDownTrust(hero, value);
    }
    await Scene.progress(dictionary['heroes.soul.matrix'], GLOBAL.MATRIX_READ);
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

  public static async progress (
      status: string,
      durationMs: number = GLOBAL.PROGRESS_DELAY,
      steps: number = GLOBAL.PROGRESS_STEPS
  ): Promise<void> {
    const generator = Renderer.generateProgress(status, steps);
    await Director.executeProgress(generator, durationMs, steps);
    Scene.break();
  }


  public static async bigBang (): Promise<void> {
    const bangGenerator = Renderer.generateBigBang();
    const labelGenerator = Renderer.generateBigBangLabel();

    await Director.executeBigBang(bangGenerator, labelGenerator);
    Scene.break();
  }

  public static async delay (timeout: number = GLOBAL.RUN_DELAY): Promise<void> {
    await Director.executeDelay(timeout);
  }

  public static break (): void {
    Scene.text('');
  }

  public static clear(): void {
    process.stdout.write(TermControls.CLEAR_SCREEN);
  }
}
