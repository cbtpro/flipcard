import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('built packages load through ESM and CommonJS', async () => {
  for (const name of ['core', 'utils', 'theme', 'vue', 'react']) {
    const esm = await import(`../packages/${name}/dist/index.es.js`);
    const cjs = require(`../packages/${name}/dist/index.cjs`);
    assert.ok(Object.keys(esm).length > 0);
    for (const key of Object.keys(esm)) assert.ok(key in cjs, `${name} exposes ${key} through require`);
  }
});

test('core trigger defaults, click toggling and listener cleanup', async () => {
  const { FlipCard } = await import('../packages/core/dist/index.es.js');
  class Element extends EventTarget {
    style = { transform: '' };
    classList = { add() {}, remove() {} };
  }
  const element = new Element();
  const hover = new FlipCard(element, { flipped: false });
  element.dispatchEvent(new Event('mouseenter'));
  assert.equal(element.style.transform, 'rotateY(180deg)');
  element.dispatchEvent(new Event('mouseleave'));
  assert.equal(element.style.transform, 'rotateY(0deg)');
  hover.destroy();
  const click = new FlipCard(element, { trigger: 'click' });
  element.dispatchEvent(new Event('click'));
  assert.equal(element.style.transform, 'rotateY(180deg)');
  element.dispatchEvent(new Event('click'));
  assert.equal(element.style.transform, 'rotateY(0deg)');
  click.destroy();
  element.dispatchEvent(new Event('click'));
  element.dispatchEvent(new Event('mouseenter'));
  assert.equal(element.style.transform, '');
});
