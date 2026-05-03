import test from 'node:test';
import assert from 'node:assert/strict';
import { createCustomBreakpoint, getDeviceCategory } from '../src/utils/breakpointUtils.js';

test('getDeviceCategory returns expected category boundaries', () => {
  assert.equal(getDeviceCategory(375).category, 'mobile');
  assert.equal(getDeviceCategory(768).category, 'tablet');
  assert.equal(getDeviceCategory(1280).category, 'desktop');
});

test('createCustomBreakpoint returns null for invalid width', () => {
  const result = createCustomBreakpoint({ name: 'Bad', width: 'abc', device: 'N/A' });
  assert.equal(result, null);
});

test('createCustomBreakpoint creates deterministic override ids for defaults', () => {
  const result = createCustomBreakpoint({ name: 'Tablet', width: '800', device: 'iPad', originalId: 'tablet' });
  assert.equal(result.id, 'custom-tablet');
  assert.equal(result.originalId, 'tablet');
  assert.equal(result.width, 800);
});
