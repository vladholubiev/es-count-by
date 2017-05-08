jest.mock('elasticsearch');

import {init, countBy} from '.';
import {Client} from 'elasticsearch';

const searchMock = jest.fn();

Client.mockImplementation(() => {
  return {
    search: searchMock
  };
});

beforeEach(() => {
  searchMock.mockClear();
});

it('should export init function', () => {
  expect(init).toBeInstanceOf(Function);
});

it('should export countBy function', () => {
  expect(countBy).toBeInstanceOf(Function);
});

it('should call ES constructor when calling init', () => {
  const host = 'http://localhost:9200';
  init(host);

  expect(Client).toBeCalledWith({host});
});

it('should call search method', async () => {
  await init('http://localhost:9200');
  await countBy('type');

  expect(searchMock).toBeCalled();
});

it('should make search request with 0 search result', async () => {
  await init('http://localhost:9200');
  await countBy('type');

  expect(searchMock).toBeCalledWith({
    body: expect.objectContaining({size: 0})
  });
});

it('should make search request with a proper aggregation', async () => {
  await init('http://localhost:9200');
  await countBy('type');

  expect(searchMock).toBeCalledWith({
    body: {
      size: 0,
      aggregations: {
        counts: {
          terms: {
            field: 'type',
            size: 0
          }
        }
      }
    }
  });
});

it('should return mapped counts as an object', async () => {
  searchMock.mockImplementationOnce(() => ({
    aggregations: {
      counts: {
        buckets: [
          {key: 'a', doc_count: 1}, // eslint-disable-line camelcase
          {key: 'b', doc_count: 2}, // eslint-disable-line camelcase
          {key: 'c', doc_count: 3} // eslint-disable-line camelcase
        ]
      }
    }
  }));

  await init('http://localhost:9200');
  const counts = await countBy('type');

  expect(counts).toEqual({
    a: 1,
    b: 2,
    c: 3
  });
});
