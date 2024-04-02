import { Rect } from '../shape';
import { isCollidingRectRect } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableRect: Rect;
let targetRect: Rect;

export function init() {
  controllableRect = { x: 4, y: 4, width: 8, height: 8 };
  targetRect = { x: 16, y: 16, width: 32, height: 32 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      controllableRect.width = randomInt(1, 30);
      controllableRect.height = randomInt(1, 30);
      controllableRect.x = 31 - controllableRect.width;
      controllableRect.y = 31 - controllableRect.height;
      targetRect.width = randomInt(1, 30);
      targetRect.height = randomInt(1, 30);
      targetRect.x = 33;
      targetRect.y = 33;
    }
    if (isPressed(BTN_U) && controllableRect.y > 0) controllableRect.y--;
    if (isPressed(BTN_D) && controllableRect.y + controllableRect.height < GFX_H) controllableRect.y++;
    if (isPressed(BTN_L) && controllableRect.x > 0) controllableRect.x--;
    if (isPressed(BTN_R) && controllableRect.x + controllableRect.width < GFX_W) controllableRect.x++;
  }

  const colliding = isCollidingRectRect(controllableRect, targetRect);

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawRectangle(targetRect.x, targetRect.y, targetRect.width, targetRect.height, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawRectangle(controllableRect.x, controllableRect.y, controllableRect.width, controllableRect.height, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'RECT-RECT', COL_RED);
}
