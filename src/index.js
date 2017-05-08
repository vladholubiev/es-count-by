import {Client} from 'elasticsearch';
import {get} from 'lodash';

let client;

/**
 * Init ES client instance
 * @param {String} host ES URL
 */
export function init(host) {
  client = new Client({host});
}

/**
 * Count documents by field
 * @param {String} field Field name to count by
 * @return {Promise.<Object>} Object in fieldValue:count format
 */
export async function countBy(field) {
  const body = {
    size: 0,
    aggregations: {
      counts: {
        terms: {
          field,
          size: 0
        }
      }
    }
  };

  const response = await client.search({body});
  const buckets = get(response, 'aggregations.counts.buckets', []);

  return buckets.reduce((memo, value) => {
    // eslint-disable-next-line camelcase
    memo[value.key] = value.doc_count;
    return memo;
  }, {});
}
