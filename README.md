# Elasticsearch Count By

> Like _.countBy from lodash, but over Elasticsearch

## Install

```shell
$ yarn add es-count-by
```

## Usage

```javascript
import {init, countBy} from 'es-count-by';

init('http://localhost:9200');

const counts = await countBy('type'); // {a: 1, b: 2, c: 3}
```
