export interface FlipCardOptions {
  trigger?: 'click' | 'hover';
  flipped?: boolean;
}

export class FlipCard {
  private el: HTMLElement;
  private options: FlipCardOptions;
  private flipped: boolean = false;
  private cleanupFns: (() => void)[] = [];

  constructor(el: HTMLElement, options: FlipCardOptions = { trigger: 'hover' }) {
    this.el = el;
    this.options = options;
    this.flipped = !!options.flipped;

    this.setup();
  }

  private setup() {
    this.el.classList.add('flipcard-core');
    this.updateTransform();

    if (this.options.trigger === 'hover') {
      const onEnter = () => this.flip(true);
      const onLeave = () => this.flip(false);
      this.el.addEventListener('mouseenter', onEnter);
      this.el.addEventListener('mouseleave', onLeave);
      this.cleanupFns.push(() => {
        this.el.removeEventListener('mouseenter', onEnter);
        this.el.removeEventListener('mouseleave', onLeave);
      });
    }
  }

  flip(state?: boolean) {
    this.flipped = typeof state === 'boolean' ? state : !this.flipped;
    this.updateTransform();
  }

  private updateTransform() {
    this.el.style.transform = this.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }

  destroy() {
    this.cleanupFns.forEach(fn => fn());
    this.el.classList.remove('flipcard-core');
  }
}
