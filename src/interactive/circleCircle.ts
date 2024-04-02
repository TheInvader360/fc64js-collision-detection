import { Circle } from '../shape';
import { isCollidingCircleCircle } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableCircle: Circle;
let targetCircle: Circle;

export function init() {
  controllableCircle = { x: 16, y: 16, radius: 5 };
  targetCircle = { x: 32, y: 32, radius: 11 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      controllableCircle.radius = randomInt(0, 16);
      targetCircle.radius = randomInt(0, 14);
      const angle = Math.random() * Math.PI * 2;
      controllableCircle.x = targetCircle.x + Math.cos(angle) * (targetCircle.radius + controllableCircle.radius + 3);
      controllableCircle.y = targetCircle.y + Math.sin(angle) * (targetCircle.radius + controllableCircle.radius + 3);
    }
    if (isPressed(BTN_U) && controllableCircle.y > 0) controllableCircle.y--;
    if (isPressed(BTN_D) && controllableCircle.y < GFX_H - 1) controllableCircle.y++;
    if (isPressed(BTN_L) && controllableCircle.x > 0) controllableCircle.x--;
    if (isPressed(BTN_R) && controllableCircle.x < GFX_W - 1) controllableCircle.x++;
  }

  const colliding = isCollidingCircleCircle(controllableCircle, targetCircle);

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawCircle(targetCircle.x, targetCircle.y, targetCircle.radius, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawCircle(controllableCircle.x, controllableCircle.y, controllableCircle.radius, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'CIRCLE-CIRCLE', COL_RED);
}
