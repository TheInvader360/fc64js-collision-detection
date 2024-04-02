import { Mode, changeMode, drawTextCentered } from './main';

let current: number;
let options: string[];

export function init() {
  if (current === undefined) current = 0;
  options = Object.values(Mode);
  options.shift();
}

export function loop(ticks: number) {
  if (isJustPressed(BTN_L) && current > 0) current--;
  if (isJustPressed(BTN_R) && current < options.length - 1) current++;
  if (isJustPressed(BTN_A)) changeMode(options[current] as Mode);

  clearGfx();
  drawTextCentered(1, 'COLLISION', COL_WHT);
  drawTextCentered(7, 'DETECTION', COL_WHT);
  drawTextCentered(13, 'DEMOS', COL_WHT);
  if (current > 0 && ticks % 40 > 10) drawText(1, 32, '<', COL_WHT);
  drawTextCentered(32, options[current], COL_YEL);
  if (current < Object.keys(Mode).length - 2 && ticks % 40 > 10) drawText(59, 32, '>', COL_WHT);
  drawTextCentered(52, 'A:SELECT', COL_WHT);
  drawTextCentered(58, 'B:RETURN', COL_WHT);
}
