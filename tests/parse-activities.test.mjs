import assert from 'node:assert/strict';
import test from 'node:test';
import { parseActivities } from '../src/utils/parse-activities.ts';

test('preserves usable activity details', () => {
  const activity = {
    id: 'activity-1',
    title: 'Ace the Interview',
    actor: { displayName: 'Career Center' },
    object: { objectType: 'event' },
    published: '2026-09-28T17:10:35.371Z',
  };
  assert.deepEqual(parseActivities([activity]), [activity]);
});

test('rejects a response that is not an array', () => {
  for (const response of [null, undefined, {}, { activities: [] }, 'error', 42]) {
    assert.throws(() => parseActivities(response), /unexpected response format/);
  }
});

test('skips malformed entries and entries without a usable title or ID', () => {
  const valid = { id: 'valid', title: 'Valid activity' };
  const entries = [null, [], 42, 'invalid', {}, { id: 'no-title' }, { title: 'No ID' }];
  for (const value of [undefined, null, '', '   ', 42, {}, []]) {
    entries.push({ id: 'bad-title', title: value }, { id: value, title: 'Bad ID' });
  }
  const activities = parseActivities([...entries, valid]);
  assert.equal(activities.length, 1);
  assert.equal(activities[0].id, 'valid');
  assert.equal(activities[0].title, 'Valid activity');
});

test('omits absent, null, empty, and wrongly typed optional details', () => {
  const values = [undefined, null, '', '   ', 42, false, {}, []];
  for (const value of values) {
    for (const details of [
      { actor: value, object: value, published: value },
      { actor: { displayName: value }, object: { objectType: value }, published: value },
    ]) {
      const [activity] = parseActivities([{ id: '1', title: 'Activity', ...details }]);
      assert.equal(activity.actor?.displayName, undefined);
      assert.equal(activity.object?.objectType, undefined);
      assert.equal(activity.published, undefined);
    }
  }
});

test('omits an unparseable publish date without dropping the activity', () => {
  const [activity] = parseActivities([{ id: '1', title: 'Activity', published: 'not a date' }]);
  assert.equal(activity.title, 'Activity');
  assert.equal(activity.published, undefined);
});

test('handles empty feeds and trims surrounding whitespace', () => {
  assert.deepEqual(parseActivities([]), []);
  const [activity] = parseActivities([{
    id: ' 1 ', title: ' Activity ', actor: { displayName: ' Organization ' },
  }]);
  assert.equal(activity.id, '1');
  assert.equal(activity.title, 'Activity');
  assert.equal(activity.actor.displayName, 'Organization');
});
