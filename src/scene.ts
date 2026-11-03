import dictionary from './dictionary.json';
import { GLOBAL } from './GLOBAL';
import { SoulInstance } from './humanSoul';
import { Renderer } from './renderer';
import { Director } from './director';

export class Scene {
  private static object (header: string, properties: string): void {
    Scene.text(`${ Renderer.objectHeader(header) }:${ Renderer.properties(properties) }`);
  }

  public static highlight (message: string) {
    return Renderer.highlight(message);
  }

  public static text (message: string, ...rest: any[]): void {
    console.log(Scene.highlight(message), ...rest);
  }

  public static async type (text: string, delayMs: number = GLOBAL.CHUNK): Promise<void> {
    const generator = Renderer.generateTypewriter(Scene.highlight(text));
    await Director.execute(generator, delayMs);
    Scene.break();
  }

  public static async spinAndType (status: string, delayMs: number = GLOBAL.CHUNK): Promise<void> {
    const generator = Renderer.generateTypewriter(Scene.highlight(status), true);
    await Director.execute(generator, delayMs);
    Scene.break();
  }

  public static header (message: string): void {
    Scene.text(Renderer.header(message));
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
    Scene.object(header, Renderer.card(hero, dynamicOnly));
  }

  public static acquaintance (hero1: SoulInstance, hero2: SoulInstance): void {
    hero1.acquaintance(hero2);
    Scene.text(Renderer.levelUpTrust(hero1));
    Scene.text(Renderer.levelUpTrust(hero2));
    Scene.text(Renderer.acquaintance(hero1));
  }

  public static efficiency (hero: SoulInstance): void {
    Scene.text(Renderer.efficiency(hero), [hero.getTeamEfficiency()]);
  }

  public static async updateTrustLevel (
      hero: SoulInstance,
      value: number,
      up: boolean = true
  ): Promise<void> {
    if (up) {
      hero.levelUpTrust(value);
      Scene.text(Renderer.levelUpTrust(hero));
    } else {
      hero.levelDownTrust(value);
      Scene.text(Renderer.levelDownTrust(hero));
    }

    if (!hero.partner) return;

    await Scene.progress(dictionary['heroes.soul.matrix'], GLOBAL.MATRIX_READ);

    Scene.object(hero.partner.name, Renderer.card(hero.partner));
    Scene.object(hero.name, Renderer.card(hero));
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

  public static clear (): void {
    Director.clearScreen();
  }

  public static init (): void {
    Director.initKeyboard();
  }

  public static release (): void {
    Director.release();
  }
}
