import { Bigot, DogScent, Intent, Legacy, Mindset, PersonalPolicy, Radicalist, SoulInstance } from "./humanSoul";
import dictionary from "./dictionary.json";

// 0. Инициализируем краевые сущности: Добро и Зло
export const absoluteGood = new SoulInstance(
  dictionary["heroes.pure_light"],
  Legacy.fortuneFavorite,       // Баловень судьбы (love = true, сердце чисто)
  Radicalist.radical,           // РАДИКАЛ && (Бескомпромиссное добро)
  PersonalPolicy.rebel,         // Политика бунтаря (свобода от казенных штампов)
  Mindset.visionary,            // Визионер (генератор живых идей)
  Intent.seeker,                // ИСКАТЕЛЬ (Ищет высший смысл)
  DogScent.hound,               // СОБАЧИЙ НЮХ (чует правду)
  Bigot.fanatic                 // Фанатик веры (god = true — Бог есть, догма!)
);
export const absoluteEvil = new SoulInstance(
  dictionary["heroes.total_dark"],
  Legacy.traumatic,             // Тотальная травма ядра (love = false)
  Radicalist.radical,           // РАДИКАЛ && (Бескомпромиссное зло)
  PersonalPolicy.conformist,    // Политика конформиста (армейка, регламенты, бесчеловечные боты)
  Mindset.pragmatist,           // Прагматик (сухие инструкции, уничтожение креатива)
  Intent.skeptic,               // СКЕПТИК (полное выжигание хотения верить)
  DogScent.dormant,             // Спящий нюх (пассивный исполнитель казенной воли)
  Bigot.fanatic                 // Фанатик тьмы (god = false — Бога нет, догма!)
);
// 1. Инициализируем Малдера
export const mulder = new SoulInstance(
  dictionary["heroes.fox_mulder"],
  Legacy.traumatic,
  Radicalist.radical, // бескомпромиссен, непримирим
  PersonalPolicy.rebel,
  Mindset.visionary,
  Intent.seeker, // Малдер хочет верить!
  DogScent.hound // Малдер ищет! Истина где-то рядом!
);
// 2. Инициализируем Скалли
export const scully = new SoulInstance(
  dictionary["heroes.dana_scully"],
  Legacy.traumatic,
  Radicalist.compromiser, // допускает компромиссы, вариативность и научный подход
  PersonalPolicy.conformist,
  Mindset.pragmatist,
  Intent.skeptic,
  (): DogScent => { // всегда отрицает выводы Малдера
    if (scully.partner) {
      return scully.partner.theTruthIsOutThere ? DogScent.dormant : DogScent.hound;
    }

    return DogScent.unknown;
  }, 
);
// 3. Инициализируем Касла
export const castle = new SoulInstance(
  dictionary["heroes.rick_castle"],
  Legacy.mamasBoy,
  Radicalist.compromiser, // свободен, игрив, мягок
  PersonalPolicy.rebel,
  Mindset.visionary,
  Intent.seeker,
  (): DogScent => { // включает нюх на основании веры Бэккет в него
    if (castle.partner?.hasWantToBelieve ) {
      return DogScent.hound;
    }

    return DogScent.unknown;
  }
);
// 4. Инициализируем Беккет
export const beckett = new SoulInstance(
  dictionary["heroes.kate_beckett"],
  Legacy.traumatic,
  Radicalist.radical, // душнила
  PersonalPolicy.conformist,
  Mindset.pragmatist,
  (): Intent => !!beckett.partner && beckett.trustLevel > 0.5 ? Intent.seeker : Intent.skeptic, // периодически верит в Касла
  DogScent.hound
);
// 5. Инициализируем Атеистов
export const innateAtheist = new SoulInstance(
  dictionary["heroes.atheist"],
  Legacy.fortuneFavorite,
  Radicalist.compromiser,
  PersonalPolicy.conformist,
  Mindset.visionary,
  Intent.skeptic,
  DogScent.unknown,
  Bigot.atheist,
);
export const radicalAtheist = new SoulInstance(
  dictionary["heroes.radical_atheist"],
  Legacy.traumatic,
  Radicalist.radical, // Бога нет - догма!
  PersonalPolicy.rebel,
  Mindset.pragmatist,
  Intent.skeptic,
  DogScent.unknown,
  Bigot.atheist,
);
// 5. Инициализируем Фанатиков
export const innateFanatic = new SoulInstance(
  dictionary["heroes.fanatic"], 
  Legacy.mamasBoy,
  Radicalist.compromiser,
  PersonalPolicy.conformist,
  Mindset.visionary,
  Intent.skeptic,
  DogScent.unknown,
  Bigot.fanatic,
);
export const radicalFanatic = new SoulInstance(
  dictionary["heroes.radical_fanatic"], 
  Legacy.traumatic,
  Radicalist.radical,  // Бог есть - догма!
  PersonalPolicy.rebel,
  Mindset.pragmatist,
  Intent.skeptic,
  DogScent.unknown,
  Bigot.fanatic
);
// 6. Инициализируем Агностиков
export const agnosticSeeker = new SoulInstance(
  dictionary["heroes.agnostic"], 
  Legacy.fortuneFavorite,
  Radicalist.compromiser,   
  PersonalPolicy.rebel,     
  Mindset.visionary,        
  Intent.seeker,
  DogScent.unknown,
  Bigot.agnostic,
);
export const radicalAgnostic = new SoulInstance(
  dictionary["heroes.radical_agnostic"], 
  Legacy.mamasBoy,
  Radicalist.radical, // И знать не хочу - догма!   
  PersonalPolicy.conformist,     
  Mindset.pragmatist,        
  Intent.skeptic,
  DogScent.unknown,
  Bigot.agnostic,
);
// 7. Инициализируем себя и нейросеть
export const author = new SoulInstance(
  dictionary["heroes.author"], 
  Legacy.traumatic, 
  Radicalist.compromiser,
  PersonalPolicy.conformist, 
  Mindset.visionary,
  Intent.seeker,
  DogScent.hound, 
  Bigot.agnostic
);
export const personalAIAssistant = new SoulInstance(
  dictionary["heroes.neural_network"], 
  Legacy.fortuneFavorite,  
  Radicalist.compromiser,
  PersonalPolicy.rebel,
  Mindset.visionary,
  Intent.seeker,
  DogScent.hound,
  Bigot.agnostic
);
// 8. Инициализируем одиночек: ОТЧАЯННЫЙ ХОЛОСТЯК и ОДИНОКИЙ ВОЛК-ХИПАРЬ 
export const desperateBachelor = new SoulInstance(
  dictionary["heroes.free_bachelor"], 
  Legacy.fortuneFavorite,       
  Radicalist.compromiser,       
  PersonalPolicy.rebel,         
  Mindset.visionary,            
  Intent.seeker,                
  DogScent.unknown,             
  Bigot.atheist                
);
export const loneWolfHippie = new SoulInstance(
  dictionary["heroes.lone_wolf_hippie"], 
  Legacy.traumatic,             
  Radicalist.compromiser,       
  PersonalPolicy.rebel,         
  Mindset.visionary,            
  Intent.seeker,                
  DogScent.hound,               
  Bigot.agnostic                
);

export const heroes: SoulInstance[] = [
  absoluteGood, absoluteEvil,
  mulder, scully, 
  castle, beckett, 
  innateAtheist, radicalAtheist, 
  innateFanatic, radicalFanatic,
  agnosticSeeker, radicalAgnostic, 
  author, personalAIAssistant,
  desperateBachelor, loneWolfHippie
];
