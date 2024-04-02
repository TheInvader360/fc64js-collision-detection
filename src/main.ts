import 'fc64js';
import { init as initMenu, loop as loopMenu } from './menu';
import { init as initAutoplay, loop as loopAutoplay } from './autoplay';
import { init as initPointPoint, loop as loopPointPoint } from './interactive/pointPoint';
import { init as initPointLine, loop as loopPointLine } from './interactive/pointLine';
import { init as initPointCircle, loop as loopPointCircle } from './interactive/pointCircle';
import { init as initPointRect, loop as loopPointRect } from './interactive/pointRect';
import { init as initPointPoly, loop as loopPointPoly } from './interactive/pointPoly';
import { init as initLineLine, loop as loopLineLine } from './interactive/lineLine';
import { init as initLineCircle, loop as loopLineCircle } from './interactive/lineCircle';
import { init as initLineRect, loop as loopLineRect } from './interactive/lineRect';
import { init as initLinePoly, loop as loopLinePoly } from './interactive/linePoly';
import { init as initCircleCircle, loop as loopCircleCircle } from './interactive/circleCircle';
import { init as initCircleRect, loop as loopCircleRect } from './interactive/circleRect';
import { init as initCirclePoly, loop as loopCirclePoly } from './interactive/circlePoly';
import { init as initRectRect, loop as loopRectRect } from './interactive/rectRect';
import { init as initRectPoly, loop as loopRectPoly } from './interactive/rectPoly';
import { init as initPolyPoly, loop as loopPolyPoly } from './interactive/polyPoly';

fc64Init(romInit, romLoop);

export enum Mode {
  Menu = 'Menu',
  Autoplay = 'AUTOPLAY',
  PointPoint = 'POINT-POINT',
  PointLine = 'POINT-LINE',
  PointCircle = 'POINT-CIRCLE',
  PointRect = 'POINT-RECT',
  PointPoly = 'POINT-POLY',
  LineLine = 'LINE-LINE',
  LineCircle = 'LINE-CIRCLE',
  LineRect = 'LINE-RECT',
  LinePoly = 'LINE-POLY',
  CircleCircle = 'CIRCLE-CIRCLE',
  CircleRect = 'CIRCLE-RECT',
  CirclePoly = 'CIRCLE-POLY',
  RectRect = 'RECT-RECT',
  RectPoly = 'RECT-POLY',
  PolyPoly = 'POLY-POLY',
}

let ticks: number;
let mode: Mode;

function romInit() {
  changeMode(Mode.Menu);
}

function romLoop() {
  ticks++;
  if (isPressed(BTN_B)) changeMode(Mode.Menu);
  if (mode === Mode.Menu) loopMenu(ticks);
  if (mode === Mode.Autoplay) loopAutoplay(ticks);
  if (mode === Mode.PointPoint) loopPointPoint(ticks);
  if (mode === Mode.PointLine) loopPointLine(ticks);
  if (mode === Mode.PointCircle) loopPointCircle(ticks);
  if (mode === Mode.PointRect) loopPointRect(ticks);
  if (mode === Mode.PointPoly) loopPointPoly(ticks);
  if (mode === Mode.LineLine) loopLineLine(ticks);
  if (mode === Mode.LineCircle) loopLineCircle(ticks);
  if (mode === Mode.LineRect) loopLineRect(ticks);
  if (mode === Mode.LinePoly) loopLinePoly(ticks);
  if (mode === Mode.CircleCircle) loopCircleCircle(ticks);
  if (mode === Mode.CircleRect) loopCircleRect(ticks);
  if (mode === Mode.CirclePoly) loopCirclePoly(ticks);
  if (mode === Mode.RectRect) loopRectRect(ticks);
  if (mode === Mode.RectPoly) loopRectPoly(ticks);
  if (mode === Mode.PolyPoly) loopPolyPoly(ticks);
}

export function changeMode(newMode: Mode) {
  ticks = 0;
  mode = newMode;
  if (mode === Mode.Menu) initMenu();
  if (mode === Mode.Autoplay) initAutoplay();
  if (mode === Mode.PointPoint) initPointPoint();
  if (mode === Mode.PointLine) initPointLine();
  if (mode === Mode.PointCircle) initPointCircle();
  if (mode === Mode.PointRect) initPointRect();
  if (mode === Mode.PointPoly) initPointPoly();
  if (mode === Mode.LineLine) initLineLine();
  if (mode === Mode.LineCircle) initLineCircle();
  if (mode === Mode.LineRect) initLineRect();
  if (mode === Mode.LinePoly) initLinePoly();
  if (mode === Mode.CircleCircle) initCircleCircle();
  if (mode === Mode.CircleRect) initCircleRect();
  if (mode === Mode.CirclePoly) initCirclePoly();
  if (mode === Mode.RectRect) initRectRect();
  if (mode === Mode.RectPoly) initRectPoly();
  if (mode === Mode.PolyPoly) initPolyPoly();
}

export const cyclingColor = (currentTicks: number, ticksPerColor: number) => {
  const remainder = currentTicks % (3 * ticksPerColor);
  return remainder < ticksPerColor ? COL_RED : remainder < 2 * ticksPerColor ? COL_GRN : COL_BLU;
};

export const drawTextCentered = (y: number, content: string, color: number) => drawText((64 - content.length * 4) / 2, y, content, color);

export const resetTicks = () => (ticks = 0);
