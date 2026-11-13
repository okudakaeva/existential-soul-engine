import { Terminal } from '@xterm/xterm';
import { XtermAdapter } from './terminal/xtermAdapter.ts';
import { run } from './main.ts';
import { Director } from './director.ts';
import { Scene } from './scene.ts';

const COLS = 102;

function calculateFontSize (): number {
  const availableWidth = Math.min(window.innerWidth - 40, 1060);
  const calculated = Math.floor(availableWidth / (COLS * 0.6));
  return Math.max(10, Math.min(calculated, 16));
}

const term = new Terminal({
  cols: COLS,
  rows: 30,
  scrollback: 5000,
  convertEol: true,
  cursorBlink: false,
  cursorStyle: 'underline',
  cursorInactiveStyle: 'none',
  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Monaco, "Courier New", monospace',
  fontSize: calculateFontSize(),
  lineHeight: 1.25,
  theme: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    cursor: '#0d1117',
  },
});

const container = document.getElementById('terminal')!;
term.open(container);

function syncTerminalGeometry (): void {
  term.options.fontSize = calculateFontSize();

  const screenElement = container.querySelector('.xterm-screen') as HTMLElement | null;
  if (!screenElement) {
    return;
  }

  const cellHeight = screenElement.clientHeight / term.rows;
  if (cellHeight > 0) {
    const targetRows = Math.max(15, Math.floor(container.clientHeight / cellHeight));
    term.resize(COLS, targetRows);
  }
}

requestAnimationFrame(() => {
  syncTerminalGeometry();
  term.focus();
});

window.addEventListener('resize', syncTerminalGeometry);
window.addEventListener('click', () => term.focus());

const adaptor = new XtermAdapter(term);
Director.setAdapter(adaptor);
run().then(() => Scene.break());
