export const distance = (x1: number, y1: number, x2: number, y2: number): number => Math.sqrt(distanceSquared(x1, y1, x2, y2));

const distanceSquared = (x1: number, y1: number, x2: number, y2: number): number => (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
