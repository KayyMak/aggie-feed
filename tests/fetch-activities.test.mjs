import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchActivities } from '../src/api/activities.ts';

const activities = [{ id: '1', title: 'Activity' }];

test('a fresh request can succeed after an HTTP failure', async context => {
  let attempts = 0;
  const mockedFetch = context.mock.method(globalThis, 'fetch', async () => {
    attempts += 1;
    return attempts === 1
      ? new Response('Service unavailable', { status: 503 })
      : Response.json(activities);
  });
  await assert.rejects(fetchActivities(new AbortController().signal), /Request failed \(503\)/);

  const signal = new AbortController().signal;
  assert.deepEqual(await fetchActivities(signal), activities);
  assert.equal(mockedFetch.mock.callCount(), 2);
  assert.equal(mockedFetch.mock.calls[1].arguments[1].signal, signal);
});

test('a fresh request can succeed after a network failure', async context => {
  let attempts = 0;
  context.mock.method(globalThis, 'fetch', async () => {
    if (++attempts === 1) throw new TypeError('Network request failed');
    return Response.json(activities);
  });
  await assert.rejects(fetchActivities(new AbortController().signal), /Network request failed/);
  assert.deepEqual(await fetchActivities(new AbortController().signal), activities);
});

test('invalid JSON reaches the error handler instead of appearing as success', async context => {
  context.mock.method(globalThis, 'fetch', async () => new Response('invalid JSON'));
  await assert.rejects(fetchActivities(new AbortController().signal), SyntaxError);
});
