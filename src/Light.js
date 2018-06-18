import { GameObject } from './GameObject';

import { clamp, within, lighten } from './utils';

export class Light extends GameObject {
  constructor (x, y) {
    super(x, y);
    this.x = x;
    this.y = y;

    this.radius = 8;
    this.color = '#f9a602';

    this.shadowColor = lighten(this.color, 30);
  }

  isStatic () { return !this.isDragging; }

  preDraw ({ lightX, lightY, isDragging }) {
    this.isDragging = isDragging;

    if (!isDragging) return;

    this.x = lightX;
    this.y = lightY;
  }

  draw (screen) {
    screen.fillStyle = this.color;

    screen.shadowColor = this.shadowColor;
    screen.shadowBlur = 40;

    screen.beginPath();
    screen.arc(
      this.x,
      this.y,
      this.radius,
      0,
      2 * Math.PI
    );

    screen.fill();
  }

  isVisible (x1, y1, x2, y2) {
    return within(this.x, x1 - this.radius * 2, x2 + this.radius * 2) &&
           within(this.y, y1 - this.radius * 2, y2 + this.radius * 2);
  }

  containsXY ({x, y}) {
    const relX = this.x - x;
    const relY = this.y - y;

    return relX ** 2 + relY ** 2 <= this.radius ** 2;
  }
}