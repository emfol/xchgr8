const utils = require('../utils');
const cache = require('./index.js');

const TTL = 250;

describe('Cache', () => {
  let oldTTL;

  beforeAll(() => {
    oldTTL = cache.getOption('ttl');
    cache.setOption('ttl', TTL);
  });

  afterAll(() => {
    cache.setOption('ttl', oldTTL);
  });

  test('Writing', async () => {
    const key = 'my_cache_key';
    const result = await cache.write(key, 'Oops!');
    expect(result).toBe(true);
  });

  test('Reading', async () => {
    const key = 'my_cache_key';
    const json = JSON.stringify({a: 'A', b: 'B'});
    let result = await cache.write(key, json);
    expect(result).toBe(true);
    result = await cache.read(key);
    expect(result).toBe(json);
  });

  test('TTL', async () => {
    const key = 'my_cache_key';
    const data = 'Oops! x2';
    let result = await cache.write(key, data);
    expect(result).toBe(true);
    result = await cache.read(key);
    expect(result).toBe(data);
    // sleep
    await utils.timeout(TTL);
    result = await cache.read(key);
    expect(result).toBe(null);
  });
});
