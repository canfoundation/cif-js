// tslint:disable:no-implicit-dependencies
import helper from './helper';

require('dotenv-extended').load();

import { TextDecoder, TextEncoder } from 'util';
import _ from 'lodash';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import { logger } from '../src/utils/logger';
import app from '../src/app';

app.init(process.env.app__can_main_net_url, fetch, TextEncoder, TextDecoder);
const rpc = app.rpc;

logger.debug('__dirname', __dirname);
logger.debug('process.cwd()', process.cwd());

const templateSettings = {
  interpolate: /\{\{([\s\S]+?)}}/g,
};

const tsInterface = _.template(fs.readFileSync(path.resolve(__dirname, './TsInterface.hbs')).toString(), {
  ...templateSettings,
});

const actionNameEnum = _.template(fs.readFileSync(path.resolve(__dirname, './ActionNameEnum.hbs')).toString(), {
  ...templateSettings,
});

const tableNameEnum = _.template(fs.readFileSync(path.resolve(__dirname, './TableNameEnum.hbs')).toString(), {
  ...templateSettings,
});

function loadAbi() {
  return rpc.get_abi(process.env.app__can_governance_account);
}

async function printOutStructs(structs) {
  for (const struct of structs) {
    const name = _.upperFirst(_.camelCase(struct.name));
    const fields = [];
    const imports = new Map<string, Set<string>>();

    struct.fields.forEach(f => {
      const typeName = helper.typeMap(f.type, imports);
      fields.push(`  ${f.name}: ${typeName};`);
    });

    const file = tsInterface({
      name,
      fields: fields.join('\n'),
      imports: Array.from(imports.keys())
        .map(k => {
          return `import {${Array.from(imports.get(k)).join(', ')}} from '${k}';`;
        })
        .join('\n'),
    });

    fs.writeFileSync(path.resolve(__dirname, `../src/smart-contract-types/${name}.ts`), file);
  }
}

function printOutActions(actions) {
  const enumFields = [];
  for (const { name } of actions) {
    enumFields.push(`${_.upperCase(name)} = '${name}'`);
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../src/smart-contract-types/ActionNameEnum.ts`),
    actionNameEnum({
      enumFields: enumFields.join(', \n'),
    }),
  );
}

function printOutTables(tables) {
  const enumFields = [];
  for (const { name } of tables) {
    enumFields.push(`${_.toUpper(name.replace('.', '_'))} = '${name}'`);
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../src/smart-contract-types/TableNameEnum.ts`),
    tableNameEnum({
      enumFields: enumFields.join(', \n'),
    }),
  );
}

async function run() {
  Object.keys(process.env)
    .filter(k => /^app__.*/.test(k))
    .forEach(k => {
      logger.debug(`process.env.${k}`, process.env[k]);
    });

  const { abi } = await loadAbi();
  await printOutStructs(abi.structs);
  await printOutActions(abi.actions);
  await printOutTables(abi.tables);

  shell.exec('yarn lint src/smart-contract-types/*.ts');
  shell.exec('yarn prettier --write src/smart-contract-types/*.ts');
}

run().catch(err => logger.error('---- run:', err));
