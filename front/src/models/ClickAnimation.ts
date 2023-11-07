import * as PIXI from "pixi.js";
// @ts-ignore
import { PixiEvents } from "../../types";
import gsap from "gsap";

export class ClickAnimation extends PIXI.Graphics {
  color: string;
  alpha: number;
  maxRadius: number;
  animationSpeed: number;

  constructor(
    x: number = 0,
    y: number = 0,
    color: string,
    stage: PIXI.Container
  ) {
    super();

    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = 1; // Initial alpha (opacity)
    this.maxRadius = 50; // Maximum radius for the ripple
    this.animationSpeed = 0.02; // Adjust this to control the animation speed

    if (!stage) {
      console.error("Stage is undefined. ClickAnimation cannot be created.");
      return;
    }

    stage.addChild(this);
    this.animate();
  }

  create() {
    return this;
  }

  animate() {
    const rippleCount = 1;
    const spacing = 30;
    const duration = 1.5;
    const delay = 3;
    const radius = 20;

    for (let i = 0; i < rippleCount; i++) {
      const radiusRandomFactor = Math.random() * 2;
      const ripple = new PIXI.Graphics();
      ripple.lineStyle(2, this.color, 1);
      ripple.drawCircle(0, 0, radius + spacing + radiusRandomFactor * i);
      ripple.endFill();

      ripple.scale.set(0);
      ripple.alpha = 1;

      this.addChild(ripple);

      gsap.to(ripple.scale, {
        x: 1,
        y: 1,
        duration: duration,
        delay: delay * i,
        ease: "power3.out",
      });

      gsap.to(ripple, {
        alpha: 0,
        duration: duration / 1.5,
        delay: delay * i,
        ease: "power3.out",
        onComplete: () => {
          this.destroy();
        },
      });
    }
  }

  addToStage(stage: PIXI.Container) {
    stage.addChild(this);
  }

  update() {
    return this;
  }

  destroy() {
    if (this.parent) this.parent.removeChild(this);
  }
}
