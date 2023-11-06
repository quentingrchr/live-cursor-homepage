import * as PIXI from "pixi.js";
// @ts-ignore
import { PixiEvents } from "../types";
import gsap from "gsap";

export class ClickAnimation extends PIXI.Graphics {
  color: string;
  radius: number;
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
    this.radius = 20; // Initial radius
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
    this.emit(PixiEvents.StartClickAnimation);
    const rippleCount = 1; // Number of ripples
    const spacing = 40; // Spacing between ripples
    const duration = 1.5; // Duration of each ripple animation
    const delay = 3; // Delay between each ripple animation

    for (let i = 0; i < rippleCount; i++) {
      const ripple = new PIXI.Graphics();
      ripple.lineStyle(2, this.color || 0xffffff, 1);
      ripple.drawCircle(0, 0, this.radius + spacing * i);
      ripple.endFill();

      ripple.scale.set(0); // Start with scale set to 0
      ripple.alpha = 1; // Start with maximum opacity

      this.addChild(ripple);

      gsap.to(ripple.scale, {
        x: 1,
        y: 1,
        duration: duration,
        ease: "power3.out",
      });

      gsap.to(ripple, {
        alpha: 0, // Animate opacity to 0
        duration: duration / 1.5,
        ease: "power3.out",
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
