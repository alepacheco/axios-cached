/**
 * @jest-environment jsdom
 */

import cachedGet from '../src';

// @ts-ignore
global.caches = {
  open: async () => ({
    put: () => {},
    match: () => {},
  }),
};

describe('cachedGet', () => {
  it('works like normal axios', async () => {
    const { data } = await cachedGet('https://postman-echo.com/get?foo1=bar1');

    expect(data.args).toEqual({ foo1: 'bar1' });
  });

  it('responds with data for get from cache (syncronously)', () => {
    const eventHandler = jest.fn();

    cachedGet('https://postman-echo.com/get?foo1=bar1').on(eventHandler);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler.mock.calls[0][0].data).toEqual({ foo: 'hey there' });
  });

  it('responds with data for get and awaits for server response', async () => {
    const eventHandler = jest.fn();
    const requestPromise = cachedGet(
      'https://postman-echo.com/get?foo1=bar1'
    ).on(eventHandler);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler.mock.calls[0][0].data).toEqual({ foo: 'hey there' });

    await requestPromise;

    expect(eventHandler).toHaveBeenCalledTimes(2);
    expect(eventHandler.mock.calls[1][0].data.args).toEqual({ foo1: 'bar1' });
  });
});
