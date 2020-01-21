// tslint:disable:no-implicit-dependencies
import _ from 'lodash';
import { logger } from '../src/utils/logger';

let map = new Map();

map.set('i64', 'number');
map.set('uint8', 'number');
map.set('uint64', 'number');
map.set('float64', 'number');
map.set('name', 'EosName');
map.set('asset', 'CAT_Token');
map.set('bool', 'boolean');
map.set('bytes', 'string');
map.set('time_point', 'string');

const tmpMap = new Map();

for (const [k, v] of map.entries()) {
  logger.debug('---- make array type for type:', k, v);
  tmpMap.set(k, v);
  tmpMap.set(`${k}[]`, `${v}[]`);
}

map = tmpMap;

function typeMap(type: string) {
  let typeName = map.get(type) || type;
  let typeImport;

  switch (type) {
    case 'pair_name_uint64':
    case 'pair_name_uint64[]':
    case 'pair_name_int32':
    case 'pair_name_int32[]':
    case 'RightHolder':
    case 'RightHolder[]':
      typeName = formatName(type);
      typeImport = `import { ${typeName} } from './${typeName}';`;
      break;
    case 'name':
    case 'name[]':
      typeImport = `import { EosName } from './base-types';`;
      break;
    case 'asset':
    case 'asset[]':
      typeImport = `import { CAT_Token } from './base-types';`;
      break;
  }
  return {
    typeName,
    typeImport,
  };
}

function formatName(name: string) {
  return _.upperFirst(_.camelCase(name));
}

export default {
  typeMap,
  formatName,
};
