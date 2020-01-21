// tslint:disable:no-implicit-dependencies
import helper from './helper';

require('dotenv-extended').load();

import _ from 'lodash';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import utils from '../src/utils/utils';
import { logger } from '../src/utils/logger';

const rpc = utils.makeRpc(fetch, process.env.app__can_main_net_url);

logger.debug('__dirname', __dirname);
logger.debug('process.cwd()', process.cwd());

const templateSettings = {
  interpolate: /\{\{([\s\S]+?)}}/g,
};

const tsInterface = _.template(fs.readFileSync(path.resolve(__dirname, './TsInterface.hbs')).toString(), {
  ...templateSettings,
});

function loadAbi() {
  return rpc.get_abi(process.env.app__can_governance_account);
}

async function printOutStructs(structs) {
  for (const struct of structs) {
    const name = _.upperFirst(_.camelCase(struct.name));
    const fields = [];
    const imports = new Set();

    struct.fields.forEach(f => {
      const { typeName, typeImport } = helper.typeMap(f.type);
      fields.push(`  ${f.name}: ${typeName};`);

      if (typeImport) {
        imports.add(typeImport);
      }
    });

    const file = tsInterface({
      name,
      fields: fields.join('\n'),
      imports: Array.from(imports).join('\n'),
    });

    fs.writeFileSync(path.resolve(__dirname, `../src/smart-contract-types/${name}.ts`), file);
  }
}

async function run() {
  Object.keys(process.env)
    .filter(k => /^app__.*/.test(k))
    .forEach(k => {
      logger.debug(`process.env.${k}`, process.env[k]);
    });

  const { abi } = await loadAbi();
  await printOutStructs(abi.structs);

  shell.exec('yarn lint');
  shell.exec('yarn pretty-quick');
}

run().catch(err => logger.error('---- run:', err));
