// tslint:disable:no-implicit-dependencies
import _ from 'lodash';
import { logger } from '../src/utils/logger';

let map = new Map();

map.set('i64', 'number');
map.set('uint8', 'number');
map.set('int32', 'number');
map.set('uint64', 'number');
map.set('float64', 'number');
map.set('checksum256', 'number');
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

function addImport(impHolder: Map<string, Set<string>>, from: string, tN: string): Map<string, Set<string>> {
  let tmp = impHolder.get(from);
  if (!impHolder.has(from)) {
    tmp = new Set();
    impHolder.set(from, tmp);
  }
  tmp.add(tN);
  return impHolder;
}

function typeMap(type: string, impHolder: Map<string, Set<string>>): string {
  let typeName = map.get(type) || type;

  switch (type) {
    case 'pair_name_uint64':
    case 'pair_name_uint64[]':
    case 'pair_name_int32':
    case 'pair_name_int32[]':
    case 'RightHolder':
    case 'RightHolder[]':
    case 'CodeType':
    case 'CodeType[]':
      typeName = formatName(type);
      addImport(impHolder, `./${typeName}`, typeName);
      break;
    case 'name':
    case 'name[]':
      addImport(impHolder, './base-types', 'EosName');
      break;
    case 'asset':
    case 'asset[]':
      addImport(impHolder, './base-types', 'CAT_Token');
      break;
  }
  return typeName;
}

function formatName(name: string) {
  return _.upperFirst(_.camelCase(name));
}

export default {
  typeMap,
  formatName,
};
