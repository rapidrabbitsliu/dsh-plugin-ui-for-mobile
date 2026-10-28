import test from 'node:test';
import assert from 'node:assert/strict';
import {compactStat, viewportGeometry} from '../src/mobile.mjs';

test('compact stats remove Chinese labels and shorten token units', () => {
  assert.equal(compactStat('5 轮 95 步 · 51 tok/s'), '5r 95s · 51/s');
  assert.equal(compactStat('7.3M tok · 缓存命中 32%'), '7.3M · H 32%');
});

test('uses visual viewport when keyboard overlays layout viewport', () => {
  assert.deepEqual(viewportGeometry({innerHeight:844, visualViewport:{height:480,offsetTop:24,scale:1}}), {height:480,top:24,keyboard:true});
});
test('does not subtract keyboard twice when Android resizes layout viewport', () => {
  assert.deepEqual(viewportGeometry({innerHeight:480, visualViewport:{height:480,offsetTop:0,scale:1}}), {height:480,top:0,keyboard:false});
});
test('preserves intentional pinch zoom', () => {
  assert.equal(viewportGeometry({innerHeight:844,visualViewport:{height:422,offsetTop:0,scale:2}}),null);
});
test('supports browsers without visualViewport', () => {
  assert.deepEqual(viewportGeometry({innerHeight:600}), {height:600,top:0,keyboard:false});
});
