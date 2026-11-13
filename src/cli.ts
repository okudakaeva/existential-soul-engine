import { NodeTerminalAdapter } from './terminal/nodeTerminalAdapter.ts';
import { run } from './main.ts';
import { Director } from './director.ts';
import { Scene } from './scene.ts';

const adaptor = new NodeTerminalAdapter();
Director.setAdapter(adaptor);
run().then(() => Scene.break());
