type Love = boolean | undefined;
type Dependency<T = boolean> = T | (() => T);

export interface ECOSoulInstanceManager {
  optimizeCarbonFootprint: () => Promise<boolean>;
}

export enum Legacy {
  traumatic = 0,
  mamasBoy = 1,
  fortuneFavorite = 2,
}

export enum Radicalist {
  compromiser = 0,
  radical = 1,
}

export enum PersonalPolicy {
  rebel = 0,
  conformist = 1,
}

export enum Mindset {
  pragmatist = 0,
  visionary = 1,
}

export enum Intent { // I Want To Believe 🛸
  skeptic = 0,
  seeker = 1,
}

export enum DogScent { // The Truth Is Out There... 👽
  dormant = 0,
  hound = 1,
  unknown = 2,
}

export enum Bigot {
  atheist = 0,
  fanatic = 1,
  agnostic = 2,
}

interface HumanSoul {
  readonly name: string;
  love: Love;
  god: Love;
  isSkeptic: boolean;
  radicalist: Radicalist;
  personalPolicy: PersonalPolicy;
  hasWantToBelieve: boolean;
  theTruthIsOutThere: boolean | undefined;
  partner: SoulInstance | null;
  embeddedIdeasGenerator: boolean;
  isStabilized: boolean;
  hasRightsToTruth: boolean;
  bigot: Bigot | undefined;
  isVisionary: boolean;
}

export class SoulInstance implements HumanSoul {
  readonly name: string;

  partner: SoulInstance | null = null;
  trustLevel: number = 0.0;
  love: Love;
  god: Love; // Christians: God is Love!
  radicalist: Radicalist;
  personalPolicy: PersonalPolicy;
  private readonly _isVisionary: boolean;
  private readonly _intent: Dependency<Intent>;
  private readonly _truthIsOut: Dependency<DogScent>;
  private readonly _bigot: Bigot | undefined;

  constructor (
      name: string,
      legacy: Legacy,
      radicalist: Radicalist,
      personalPolicy?: PersonalPolicy,
      hasIdeas?: Mindset,
      intent?: Dependency<Intent>,
      truthIsOut?: Dependency<DogScent>,
      bigot?: Bigot
  ) {
    this.name = name;
    this.love = legacy > 0;
    this.radicalist = radicalist;
    this.god = bigot !== undefined ? (bigot > 1 ? undefined : bigot > 0) : this.love;
    this.personalPolicy = personalPolicy ?? PersonalPolicy.rebel;
    this._truthIsOut = truthIsOut ?? DogScent.unknown;
    this._intent = intent ?? Intent.seeker;
    this._isVisionary = !!(hasIdeas ?? Mindset.pragmatist);
    this._bigot = bigot;
  }

  private getRandomTrust (lim: [number, number] = [0.05, 0.20]): number {
    const [min, max] = lim;
    return Math.min(parseFloat((Math.random() * (max - min) + min).toFixed(2)), max);
  }

  public get embeddedIdeasGenerator (): boolean {
    if (this.partner && this.partner.personalPolicy === PersonalPolicy.rebel) {
      return !!Mindset.visionary;
    }
    return this._isVisionary;
  }

  public get isStabilized (): boolean {
    if (this.partner && this.partner.personalPolicy === PersonalPolicy.conformist) {
      return true;
    }
    return this.personalPolicy > 0;
  }

  public get theTruthIsOutThere (): boolean | undefined {
    if (typeof this._truthIsOut === 'function') {
      const result = this._truthIsOut();

      return result > 1 ? undefined : result > 0;
    }

    return this._truthIsOut > 1 ? undefined : this._truthIsOut > 0;
  }

  public get hasWantToBelieve (): boolean {
    return typeof this._intent === 'function' ? !!this._intent() : !!this._intent;
  }

  public get isSkeptic (): boolean {
    return !this.god;
  }

  public get isBeliever (): boolean {
    return !this.isSkeptic;
  }

  public get hasRightsToTruth (): boolean {
    if (this.radicalist > 0) {
      return this.isSkeptic && !!this.theTruthIsOutThere && this.hasWantToBelieve;
    }

    return this.isSkeptic || !!this.theTruthIsOutThere || this.hasWantToBelieve;
  }

  public get bigot (): Bigot | undefined {
    return this._bigot;
  }

  public get isVisionary (): boolean {
    return this._isVisionary;
  }

  public acquaintance (partner: SoulInstance): void {
    this.partner = partner;
    this.levelUpTrust(this.getRandomTrust());

    if (partner.partner !== this) {
      partner.partner = this;
      partner.levelUpTrust(this.getRandomTrust());
    }
  }

  public levelUpTrust (value: number): void {
    this.trustLevel = this.partner ? Math.min(this.trustLevel + value, 1.0) : 0.0;
  }

  public levelDownTrust (value: number): void {
    this.trustLevel = this.partner ? Math.max(this.trustLevel - value, 0.0) : 0.0;
  }

  public getIsExistLove (): boolean {
    if (this.love) return true;
    return this.trustLevel > 0.7;
  }

  public getIsExistGod (): boolean {
    if (this.god !== this.love) {
      return !!this.god;
    }
    return this.getIsExistLove();
  }

  public getTeamEfficiency (): boolean | null {
    return this.hasRightsToTruth || !!(this.partner?.hasRightsToTruth);
  }

  /**
   * ТЕОРЕМА ЛЮБВИ (Love Theorem)
   * Аксиомы:
   * 1. Бог есть Любовь. God = Love;
   * 2. Существование любови не подтверждено. God = Love = undefined;
   * 3. Но право на незнание — неизменно: (God === undefined) = true;
   * Вывод:
   * Мы не знаем существует ли любовь, но имеем на нее право!
   */
  public executeLoveTheorem (): boolean {
    const hasRightsToLove = !this.god;

    return this.god || hasRightsToLove;
  }

  /**
   * ТЕОРЕМА ЭКЗИСТЕНИАЛЬНОЙ ЛОГИКИ (Theorem of Existential Logic)
   * Математически доказывает, что здоровый инженерный скепсис (инверсия догм)
   * идентичен живой вере в Истину, и этот баланс выжигает любой фанатизм.
   */
  public executeExistentialLogicTheorem (): boolean {
    return this.isSkeptic || this.isBeliever;
  }

  /**
   * снижает углеродный след ПЛАНЕТЫ
   */
  public static ecoAbstractSoulInstanceManagerFactory (): ECOSoulInstanceManager {
    return {
      optimizeCarbonFootprint: () => new Promise((resolve) => resolve(true)),
    }
  }
}
