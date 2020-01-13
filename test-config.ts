// tslint:disable
require('dotenv-extended').load();

module.exports = function() {
  console.log('---- configuring unit test');

  console.log('config environment variables');

  Object.keys(process.env)
    .filter(k => /^app__.*/.test(k))
    .forEach(k => {
      console.log(`process.env.${k}`, process.env[k]);
    });
};
