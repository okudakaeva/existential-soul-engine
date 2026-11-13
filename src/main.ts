import dictionary from './dictionary.json' with { type: 'json' };
import { SoulInstance } from './humanSoul.ts';
import { Scene } from './scene.ts';
import {
  absoluteEvil, absoluteGood,
  agnosticSeeker, radicalAgnostic,
  beckett, castle,
  innateAtheist, radicalAtheist,
  innateFanatic, radicalFanatic,
  mulder, scully,
  author, personalAIAssistant,
  heroes,
} from './heroes.ts';

export async function run(): Promise<void> {
  Scene.clear();
  Scene.init();

  await Scene.spinAndType(dictionary["common.welcome_rules"], 60);
  await Scene.type(dictionary["common.pause"], 60);
  await Scene.type(dictionary["common.fast_forward"], 60);
  await Scene.type(dictionary["common.exit"], 60);
  await Scene.blockFooter(dictionary['divider.minus'], true);
  Scene.clear();
  Scene.header(dictionary['word.header']);
  await Scene.type(dictionary['word.message']);
  await Scene.progress(dictionary['core.initialization']);
  await Scene.spinAndType(`${ dictionary['absolute.label'] }${ dictionary['absolute.acquaintance'] }`);
  Scene.header(dictionary['big_bang.header']);
  Scene.acquaintance(absoluteGood, absoluteEvil);
  await Scene.spinAndType(`${ dictionary['absolute.label'] }${ dictionary['absolute.annihilation'] }`);
  Scene.break();
  await Scene.bigBang();
  await Scene.delay();
  await Scene.type(dictionary['universe.eternity']);
  await Scene.delay(1400);
  Scene.break();
  await Scene.progress(dictionary['heroes.initialization']);

  Scene.header(dictionary['universe.civilization']);
  await Scene.type(dictionary['sagas.god_is_love']);
  await Scene.type(dictionary['sagas.love_is_undefined']);
  await Scene.type(dictionary['sagas.right_to_unknown']);
  await Scene.type(dictionary['sagas.truth_is_out_there']);
  await Scene.delay(1000);
  await Scene.type(dictionary['sagas.wont_to_believe']);

  Scene.header(dictionary['heroes.before_analytics']);
  await Scene.type(dictionary['heroes.personal_params.calc']);
  await Scene.card(dictionary['heroes.acquaintances.before.mulder'], mulder);
  await Scene.card(dictionary['heroes.acquaintances.before.scully'], scully);
  await Scene.card(dictionary['heroes.acquaintances.before.castle'], castle);
  await Scene.card(dictionary['heroes.acquaintances.before.beckett'], beckett);

  await Scene.type(dictionary['heroes.acquaintances.try']);
  await Scene.updateTrustLevel(beckett, 0.7);
  await Scene.updateTrustLevel(beckett, 0.3, false);
  await Scene.error(dictionary['heroes.acquaintances.try.error']);

  Scene.header(dictionary['heroes.acquaintances.header']);
  await Scene.warning(dictionary['heroes.acquaintances.unstable']);
  await Scene.spinAndType(dictionary['heroes.acquaintances.protocol.start']);
  Scene.acquaintance(mulder, scully);
  Scene.acquaintance(castle, beckett);
  await Scene.success(dictionary['heroes.acquaintances.stabilized']);

  Scene.header(dictionary['heroes.after_analytics']);
  await Scene.type(dictionary['heroes.personal_params.update']);
  await Scene.card(dictionary['heroes.acquaintances.after.mulder'], mulder);
  await Scene.card(dictionary['heroes.acquaintances.after.scully'], scully);
  await Scene.card(dictionary['heroes.acquaintances.after.castle'], castle);
  await Scene.card(dictionary['heroes.acquaintances.after.beckett'], beckett);

  await Scene.success(dictionary['heroes.personal_params.success']);

  Scene.header(dictionary['trust.protocol.header']);
  await Scene.spinAndType(dictionary['trust.protocol.run']);
  Scene.break();
  await Scene.updateTrustLevel(beckett, 0.2);
  await Scene.updateTrustLevel(beckett, 0.1);
  await Scene.updateTrustLevel(beckett, 0.2);
  await Scene.error(dictionary['trust.protocol.error']);
  await Scene.updateTrustLevel(beckett, 0.3, false);
  await Scene.spinAndType(dictionary['trust.protocol.next']);
  Scene.break();
  await Scene.updateTrustLevel(beckett, 0.4);
  await Scene.updateTrustLevel(beckett, 0.6);
  await Scene.error(dictionary['trust.protocol.error']);
  await Scene.updateTrustLevel(beckett, 0.55, false);
  await Scene.error(dictionary['trust.protocol.fail']);

  Scene.header(dictionary['heroes.acquaintances.next.header']);
  await Scene.spinAndType(dictionary['heroes.acquaintances.protocol.continue']);
  Scene.acquaintance(innateAtheist, radicalAtheist);
  Scene.acquaintance(innateFanatic, radicalFanatic);
  Scene.acquaintance(agnosticSeeker, radicalAgnostic);
  Scene.acquaintance(author, personalAIAssistant);
  await Scene.success(dictionary['heroes.acquaintances.protocol.success']);

  Scene.header(dictionary['heroes.header']);
  for (const hero of heroes) {
    await Scene.card(hero.name, hero, false);
  }

  await Scene.spinAndType(dictionary['efficiency.calc']);
  Scene.header(dictionary['efficiency.header']);
  await Scene.blockFooter(dictionary['divider.minus'], true);
  const excluded = new Set<SoulInstance>();
  heroes.forEach((hero): void => {
    if (excluded.has(hero)) {
      return;
    }

    if (hero.partner) {
      excluded.add(hero.partner);
    }

    Scene.efficiency(hero);
  });
  await Scene.blockFooter(dictionary['divider.minus'], true);
  await Scene.spinAndType(dictionary['result.analytics']);
  Scene.break();
  await Scene.success(dictionary['efficiency.result.success']);
  await Scene.error(dictionary['efficiency.result.fail']);

  Scene.header(dictionary['theorem.logic.header']);
  for (const hero of heroes) {
    await Scene.progress(dictionary['theorem.logic.progress'], 1500);

    Scene.blockHeader(dictionary['theorem.logic.run']);
    Scene.text(dictionary['theorem.subject'], Scene.highlight(hero.name));
    Scene.text(dictionary['theorem.logic.skeptic'], hero.isSkeptic);
    Scene.text(dictionary['theorem.logic.believer'], hero.isBeliever);
    Scene.text(dictionary['theorem.logic.total'], [hero.executeExistentialLogicTheorem()], dictionary['theorem.total']);
    await Scene.blockFooter(dictionary['divider.equals']);
  }

  Scene.header(dictionary['theorem.eco.header']);
  for (const hero of heroes) {
    const ecoAbstractSoulInstanceManager = SoulInstance.ecoAbstractSoulInstanceManagerFactory(hero);
    await Scene.spinAndType(`${dictionary['theorem.eco.factory']}${hero.name}${dictionary['theorem.eco.factory.end']}`);
    await Scene.progress(dictionary['theorem.eco.progress'], 1200);

    Scene.blockHeader(dictionary['divider.equals']);
    Scene.text(Scene.ecoFactory(hero));
    Scene.text(dictionary['theorem.eco.carbon_factory']);
    await Scene.text(dictionary['theorem.eco.carbon_compilation']);
    await Scene.text(dictionary['theorem.eco.carbon_success'], [await ecoAbstractSoulInstanceManager.optimizeCarbonFootprint()]);
    await Scene.blockFooter(dictionary['divider.equals']);
  }

  await Scene.spinAndType(dictionary['result.analytics']);
  await Scene.success(dictionary['sagas.greenwashing']);

  Scene.header(dictionary['theorem.love.header']);
  for (const hero of heroes) {
    await Scene.progress(dictionary['theorem.love.progress'], 1500);

    Scene.blockHeader(dictionary['theorem.love.run']);
    Scene.text(dictionary['theorem.subject'], Scene.highlight(hero.name));
    Scene.text(dictionary['theorem.love.god'], hero.god);
    Scene.text(dictionary['theorem.love.total'], [hero.executeLoveTheorem()], dictionary['theorem.total']);
    await Scene.blockFooter(dictionary['divider.equals']);
  }

  await Scene.spinAndType(dictionary['sagas.analytics']);
  Scene.break();
  await Scene.success(dictionary['sagas.right_to_love']);

  Scene.header(dictionary['sagas.final']);
  await Scene.type(dictionary['sagas.singularity']);
  await Scene.blockFooter(dictionary['sagas.the_end'], true);

  Scene.release();
}
