// resources/js/lib/quill-blots.ts
// Custom Quill blocks shared by every editor. The HTML they produce is styled on the
// website by the matching .t3d-* classes (trucking360-nextjs/src/app/drivers/drivers.css).
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as any;
const Block = Quill.import('blots/block') as any;

export type FigureSize = 'full' | 'wide' | 'half' | 'small';
export interface FigureValue {
  src: string;
  alt: string;
  caption?: string;
  size?: FigureSize;
}
export interface CtaValue {
  label: string;
  href: string;
  style?: 'primary' | 'outline';
}
export interface StatItem {
  value: string;
  label: string;
}
export type CalloutVariant = 'highlight' | 'info' | 'warning';

const FIGURE_SIZES: FigureSize[] = ['full', 'wide', 'half', 'small'];
export const CALLOUT_VARIANTS: CalloutVariant[] = ['highlight', 'info', 'warning'];

/** Allow only safe link targets: http(s), site-relative paths, anchors, mailto and tel. */
export function safeHref(href: string): string {
  const value = (href || '').trim();
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(value)) return value;
  return '#';
}

function safeSrc(src: string): string {
  const value = (src || '').trim();
  if (/^(https?:\/\/|\/)/i.test(value)) return value;
  return '';
}

/** <figure class="t3d-figure t3d-figure--half"><img src alt><figcaption>…</figcaption></figure> */
class FigureBlot extends BlockEmbed {
  static blotName = 'figure';
  static tagName = 'FIGURE';
  static className = 't3d-figure';

  static create(value: FigureValue) {
    const node = super.create() as HTMLElement;
    const size = FIGURE_SIZES.includes(value.size as FigureSize) ? value.size : 'full';
    node.classList.add(`t3d-figure--${size}`);
    node.setAttribute('contenteditable', 'false');

    const img = document.createElement('img');
    img.setAttribute('src', safeSrc(value.src));
    img.setAttribute('alt', value.alt || '');
    img.setAttribute('loading', 'lazy');
    node.appendChild(img);

    if (value.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = value.caption;
      node.appendChild(caption);
    }
    return node;
  }

  static value(node: HTMLElement): FigureValue | null {
    const img = node.querySelector('img');
    if (!img) return null;
    const size = FIGURE_SIZES.find((s) => node.classList.contains(`t3d-figure--${s}`)) ?? 'full';
    return {
      src: img?.getAttribute('src') ?? '',
      alt: img?.getAttribute('alt') ?? '',
      caption: node.querySelector('figcaption')?.textContent ?? '',
      size,
    };
  }
}

// Tag names are chosen so plain pasted HTML (<div>, <p>) never turns into a custom block:
// parchment matches by class first, then falls back to the first blot registered for a tag.

/** <p class="t3d-cta"><a class="t3d-btn" href>Label</a></p> */
class CtaBlot extends BlockEmbed {
  static blotName = 'cta';
  static tagName = 'P';
  static className = 't3d-cta';

  static create(value: CtaValue) {
    const node = super.create() as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    const a = document.createElement('a');
    a.className = value.style === 'outline' ? 't3d-btn t3d-btn--outline' : 't3d-btn';
    a.setAttribute('href', safeHref(value.href));
    a.textContent = value.label || 'Apply now';
    node.appendChild(a);
    return node;
  }

  static value(node: HTMLElement): CtaValue | null {
    if (!node.classList.contains('t3d-cta')) return null;
    const a = node.querySelector('a');
    return {
      label: a?.textContent ?? '',
      href: a?.getAttribute('href') ?? '#apply',
      style: a?.classList.contains('t3d-btn--outline') ? 'outline' : 'primary',
    };
  }
}

/** <dl class="t3d-stats"><div class="t3d-stat"><dd>$1,800</dd><dt>Avg weekly pay</dt></div>…</dl> */
class StatsBlot extends BlockEmbed {
  static blotName = 'stats';
  static tagName = 'DL';
  static className = 't3d-stats';

  static create(value: StatItem[]) {
    const node = super.create() as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    (Array.isArray(value) ? value : []).forEach((item) => {
      const stat = document.createElement('div');
      stat.className = 't3d-stat';
      const dd = document.createElement('dd');
      dd.textContent = item.value;
      const dt = document.createElement('dt');
      dt.textContent = item.label;
      stat.append(dd, dt);
      node.appendChild(stat);
    });
    return node;
  }

  static value(node: HTMLElement): StatItem[] | null {
    if (!node.classList.contains('t3d-stats')) return null;
    return Array.from(node.querySelectorAll('.t3d-stat')).map((stat) => ({
      value: stat.querySelector('dd')?.textContent ?? '',
      label: stat.querySelector('dt')?.textContent ?? '',
    }));
  }
}

/** <hr class="t3d-divider"> */
class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'HR';
  static className = 't3d-divider';
}

/** Editable callout line(s): <aside class="t3d-callout t3d-callout--highlight">text</aside> */
class CalloutBlot extends Block {
  static blotName = 'callout';
  static tagName = 'ASIDE';
  static className = 't3d-callout';

  static create(value: CalloutVariant) {
    const node = super.create(value) as HTMLElement;
    const variant = CALLOUT_VARIANTS.includes(value) ? value : 'highlight';
    node.classList.add(`t3d-callout--${variant}`);
    return node;
  }

  static formats(node: HTMLElement): CalloutVariant {
    return CALLOUT_VARIANTS.find((v) => node.classList.contains(`t3d-callout--${v}`)) ?? 'highlight';
  }

  format(name: string, value: CalloutVariant | false) {
    if (name === CalloutBlot.blotName && value) {
      CALLOUT_VARIANTS.forEach((v) => this.domNode.classList.remove(`t3d-callout--${v}`));
      this.domNode.classList.add(`t3d-callout--${CALLOUT_VARIANTS.includes(value) ? value : 'highlight'}`);
    } else {
      super.format(name, value);
    }
  }
}

let registered = false;

/** Register once per page load; safe to call from every editor instance. */
export function registerQuillBlots() {
  if (registered) return;
  Quill.register(
    {
      'formats/figure': FigureBlot,
      'formats/cta': CtaBlot,
      'formats/stats': StatsBlot,
      'formats/divider': DividerBlot,
      'formats/callout': CalloutBlot,
    },
    true,
  );
  registered = true;
}

export const CUSTOM_FORMATS = ['figure', 'cta', 'stats', 'divider', 'callout'];
