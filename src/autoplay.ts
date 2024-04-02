import * as collision from './collision';
import { drawTextCentered, resetTicks } from './main';
import { distance } from './maths';
import { Point, Poly } from './shape';

const COORD_MIN = 20;
const COORD_MAX = 44;
const CIRCLE_SIZE = 5;
const RECT_SIZE = 10;
const POLY_SIZE = 8;
const entities: string[] = ['POINT', 'LINE', 'CIRCLE', 'RECT', 'POLY'];
let dynamicEntityIndex: number;
let staticEntityIndex: number;
let dynamicCoords: number[];
let staticCoords: number[];
let targetCoords: number[] = [];

export function init() {
  dynamicEntityIndex = staticEntityIndex = 0;
  reset();
}

export function loop(ticks: number) {
  if (ticks > 300) {
    dynamicEntityIndex++;
    if (dynamicEntityIndex === entities.length) {
      dynamicEntityIndex = 0;
      staticEntityIndex = wrap(staticEntityIndex + 1, 0, entities.length);
    }
    reset();
  }

  if (isJustPressed(BTN_U) || isJustPressed(BTN_D) || isJustPressed(BTN_L) || isJustPressed(BTN_R)) {
    dynamicEntityIndex = wrap(dynamicEntityIndex + (isJustPressed(BTN_U) ? 1 : isJustPressed(BTN_D) ? -1 : 0), 0, entities.length);
    staticEntityIndex = wrap(staticEntityIndex + (isJustPressed(BTN_L) ? -1 : isJustPressed(BTN_R) ? 1 : 0), 0, entities.length);
    reset();
  }

  const dynamicPoints: Point[] = [];
  for (let i = 0; i < targetCoords.length; i += 2) {
    if (dynamicCoords[i] != targetCoords[i] || dynamicCoords[i + 1] != targetCoords[i + 1]) {
      const newPosition = moveTowards(dynamicCoords[i], dynamicCoords[i + 1], targetCoords[i], targetCoords[i + 1], 0.5);
      dynamicCoords[i] = newPosition.x;
      dynamicCoords[i + 1] = newPosition.y;
    } else {
      targetCoords[i] = randomInt(COORD_MIN, COORD_MAX);
      targetCoords[i + 1] = randomInt(COORD_MIN, COORD_MAX);
    }
    dynamicPoints.push({ x: Math.round(dynamicCoords[i]), y: Math.round(dynamicCoords[i + 1]) });
  }

  const colliding = isColliding(dynamicPoints);

  clearGfx(colliding ? COL_BLU : COL_BLK);
  drawTextCentered(1, `DYNAMIC ${entities[dynamicEntityIndex]}`, COL_WHT);
  drawTextCentered(58, `STATIC ${entities[staticEntityIndex]}`, COL_WHT);
  drawEntities(dynamicPoints, colliding ? COL_RED : COL_GRN);
}

const reset = () => {
  resetTicks();
  if (staticEntityIndex === 0 || staticEntityIndex === 2 || staticEntityIndex === 4) staticCoords = [randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX)];
  if (staticEntityIndex === 1) staticCoords = [randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX)];
  if (staticEntityIndex === 3) staticCoords = [randomInt(COORD_MIN, COORD_MAX) - RECT_SIZE / 2, randomInt(COORD_MIN, COORD_MAX) - RECT_SIZE / 2];

  if (dynamicEntityIndex === 0 || dynamicEntityIndex === 2 || dynamicEntityIndex === 4) {
    dynamicCoords = [randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX)];
    targetCoords = [staticCoords[0], staticCoords[1]];
  }
  if (dynamicEntityIndex === 1) {
    dynamicCoords = [randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX)];
    targetCoords = [staticCoords[0], staticCoords[1], randomInt(COORD_MIN, COORD_MAX), randomInt(COORD_MIN, COORD_MAX)];
  }
  if (dynamicEntityIndex === 3) {
    dynamicCoords = [randomInt(COORD_MIN, COORD_MAX) - RECT_SIZE / 2, randomInt(COORD_MIN, COORD_MAX) - RECT_SIZE / 2];
    targetCoords = [staticCoords[0], staticCoords[1]];
  }
};

const moveTowards = (currentX: number, currentY: number, targetX: number, targetY: number, speed: number) => {
  const dist: number = distance(currentX, currentY, targetX, targetY);
  if (dist > speed) {
    const ratio = speed / dist;
    return { x: currentX + (targetX - currentX) * ratio, y: currentY + (targetY - currentY) * ratio };
  }
  return { x: targetX, y: targetY };
};

const isColliding = (points: Point[]) => {
  if (dynamicEntityIndex === 0 && staticEntityIndex === 0) return collision.isCollidingPointPoint(points[0], { x: staticCoords[0], y: staticCoords[1] });
  if (dynamicEntityIndex === 0 && staticEntityIndex === 1) return collision.isCollidingPointLine(points[0], { x1: staticCoords[0], y1: staticCoords[1], x2: staticCoords[2], y2: staticCoords[3] });
  if (dynamicEntityIndex === 0 && staticEntityIndex === 2) return collision.isCollidingPointCircle(points[0], { x: staticCoords[0], y: staticCoords[1], radius: CIRCLE_SIZE });
  if (dynamicEntityIndex === 0 && staticEntityIndex === 3) return collision.isCollidingPointRect(points[0], { x: staticCoords[0], y: staticCoords[1], width: RECT_SIZE, height: RECT_SIZE });
  if (dynamicEntityIndex === 0 && staticEntityIndex === 4) return collision.isCollidingPointPoly(points[0], getPoly(staticCoords[0], staticCoords[1]));
  if (dynamicEntityIndex === 1 && staticEntityIndex === 0) return collision.isCollidingLinePoint({ x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y }, { x: staticCoords[0], y: staticCoords[1] });
  if (dynamicEntityIndex === 1 && staticEntityIndex === 1) return collision.isCollidingLineLine({ x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y }, { x1: staticCoords[0], y1: staticCoords[1], x2: staticCoords[2], y2: staticCoords[3] });
  if (dynamicEntityIndex === 1 && staticEntityIndex === 2) return collision.isCollidingLineCircle({ x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y }, { x: staticCoords[0], y: staticCoords[1], radius: CIRCLE_SIZE });
  if (dynamicEntityIndex === 1 && staticEntityIndex === 3) return collision.isCollidingLineRect({ x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y }, { x: staticCoords[0], y: staticCoords[1], width: RECT_SIZE, height: RECT_SIZE });
  if (dynamicEntityIndex === 1 && staticEntityIndex === 4) return collision.isCollidingLinePoly({ x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y }, getPoly(staticCoords[0], staticCoords[1]));
  if (dynamicEntityIndex === 2 && staticEntityIndex === 0) return collision.isCollidingCirclePoint({ x: points[0].x, y: points[0].y, radius: CIRCLE_SIZE }, { x: staticCoords[0], y: staticCoords[1] });
  if (dynamicEntityIndex === 2 && staticEntityIndex === 1) return collision.isCollidingCircleLine({ x: points[0].x, y: points[0].y, radius: CIRCLE_SIZE }, { x1: staticCoords[0], y1: staticCoords[1], x2: staticCoords[2], y2: staticCoords[3] });
  if (dynamicEntityIndex === 2 && staticEntityIndex === 2) return collision.isCollidingCircleCircle({ x: points[0].x, y: points[0].y, radius: CIRCLE_SIZE }, { x: staticCoords[0], y: staticCoords[1], radius: CIRCLE_SIZE });
  if (dynamicEntityIndex === 2 && staticEntityIndex === 3) return collision.isCollidingCircleRect({ x: points[0].x, y: points[0].y, radius: CIRCLE_SIZE }, { x: staticCoords[0], y: staticCoords[1], width: RECT_SIZE, height: RECT_SIZE });
  if (dynamicEntityIndex === 2 && staticEntityIndex === 4) return collision.isCollidingCirclePoly({ x: points[0].x, y: points[0].y, radius: CIRCLE_SIZE }, getPoly(staticCoords[0], staticCoords[1]));
  if (dynamicEntityIndex === 3 && staticEntityIndex === 0) return collision.isCollidingRectPoint({ x: points[0].x, y: points[0].y, width: RECT_SIZE, height: RECT_SIZE }, { x: staticCoords[0], y: staticCoords[1] });
  if (dynamicEntityIndex === 3 && staticEntityIndex === 1) return collision.isCollidingRectLine({ x: points[0].x, y: points[0].y, width: RECT_SIZE, height: RECT_SIZE }, { x1: staticCoords[0], y1: staticCoords[1], x2: staticCoords[2], y2: staticCoords[3] });
  if (dynamicEntityIndex === 3 && staticEntityIndex === 2) return collision.isCollidingRectCircle({ x: points[0].x, y: points[0].y, width: RECT_SIZE, height: RECT_SIZE }, { x: staticCoords[0], y: staticCoords[1], radius: CIRCLE_SIZE });
  if (dynamicEntityIndex === 3 && staticEntityIndex === 3) return collision.isCollidingRectRect({ x: points[0].x, y: points[0].y, width: RECT_SIZE, height: RECT_SIZE }, { x: staticCoords[0], y: staticCoords[1], width: RECT_SIZE, height: RECT_SIZE });
  if (dynamicEntityIndex === 3 && staticEntityIndex === 4) return collision.isCollidingRectPoly({ x: points[0].x, y: points[0].y, width: RECT_SIZE, height: RECT_SIZE }, getPoly(staticCoords[0], staticCoords[1]));
  if (dynamicEntityIndex === 4 && staticEntityIndex === 0) return collision.isCollidingPolyPoint(getPoly(points[0].x, points[0].y), { x: staticCoords[0], y: staticCoords[1] });
  if (dynamicEntityIndex === 4 && staticEntityIndex === 1) return collision.isCollidingPolyLine(getPoly(points[0].x, points[0].y), { x1: staticCoords[0], y1: staticCoords[1], x2: staticCoords[2], y2: staticCoords[3] });
  if (dynamicEntityIndex === 4 && staticEntityIndex === 2) return collision.isCollidingPolyCircle(getPoly(points[0].x, points[0].y), { x: staticCoords[0], y: staticCoords[1], radius: CIRCLE_SIZE });
  if (dynamicEntityIndex === 4 && staticEntityIndex === 3) return collision.isCollidingPolyRect(getPoly(points[0].x, points[0].y), { x: staticCoords[0], y: staticCoords[1], width: RECT_SIZE, height: RECT_SIZE });
  if (dynamicEntityIndex === 4 && staticEntityIndex === 4) return collision.isCollidingPolyPoly(getPoly(points[0].x, points[0].y), getPoly(staticCoords[0], staticCoords[1]));
};

const drawEntities = (roundedDynamicEntityPoints: Point[], color: number): void => {
  if (dynamicEntityIndex === 0) drawPixel(roundedDynamicEntityPoints[0].x, roundedDynamicEntityPoints[0].y, color);
  if (dynamicEntityIndex === 1) drawLine(roundedDynamicEntityPoints[0].x, roundedDynamicEntityPoints[0].y, roundedDynamicEntityPoints[1].x, roundedDynamicEntityPoints[1].y, color);
  if (dynamicEntityIndex === 2) drawCircle(roundedDynamicEntityPoints[0].x, roundedDynamicEntityPoints[0].y, CIRCLE_SIZE, color, color);
  if (dynamicEntityIndex === 3) drawRectangle(roundedDynamicEntityPoints[0].x, roundedDynamicEntityPoints[0].y, RECT_SIZE, RECT_SIZE, color, color);
  if (dynamicEntityIndex === 4) drawPolygon(getPolyVertices(roundedDynamicEntityPoints[0].x, roundedDynamicEntityPoints[0].y), color, color);
  if (staticEntityIndex === 0) drawPixel(staticCoords[0], staticCoords[1], color);
  if (staticEntityIndex === 1) drawLine(staticCoords[0], staticCoords[1], staticCoords[2], staticCoords[3], color);
  if (staticEntityIndex === 2) drawCircle(staticCoords[0], staticCoords[1], CIRCLE_SIZE, color, color);
  if (staticEntityIndex === 3) drawRectangle(staticCoords[0], staticCoords[1], RECT_SIZE, RECT_SIZE, color, color);
  if (staticEntityIndex === 4) drawPolygon(getPolyVertices(staticCoords[0], staticCoords[1]), color, color);
};

const getPoly = (centreX: number, centreY: number): Poly => ({ vertices: getPolyVertices(centreX, centreY).map(({ x, y }) => ({ x, y })) });

const getPolyVertices = (centreX: number, centreY: number): vertex2[] => [
  { x: centreX, y: centreY - POLY_SIZE },
  { x: centreX + POLY_SIZE, y: centreY },
  { x: centreX, y: centreY + POLY_SIZE },
  { x: centreX - POLY_SIZE, y: centreY },
];
