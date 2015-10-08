'use strict';
// to enable these logs set `DEBUG=boot:04-load-dwsettings` or `DEBUG=boot:*`
var log = require('debug')('boot:04-load-dwsettings');
function dwSettingFindOrCreate(app, name, value) {
  app.models.DwSetting.findOrCreate(
    {where: {setting: name}}, // find
    {
      setting: name,
      value: value
    }, // create
    function (err, data, created) {
      if (err) {
        console.error('err', err);
      }
      (created) ? log('created Setting', data.setting)
        : log('found Setting', data.setting);
    });
}
var nameValuePairs = [
  {name: 'CDR_ES_CRED', value: null},
  {name: 'CDR_ES_HOST', value: 'els.istresearch.com'},
  {name: 'CDR_ES_INDEX', value: 'memex-domains'},
  {name: 'CDR_ES_PORT', value: '9200'},
  {name: 'DEEPDIVE_REPO', value: 'atf'},
  {name: 'DEEPDIVE_URL', value: 'https://api.clearcutcorp.com/docs'},
  {name: 'DEEPDIVE_USER', value: 'justin'},
  {name: 'DIG_URL', value: 'http://none.com'},
  {name: 'DW_CONN_TYPE', value: 'mysql'},
  {name: 'DW_CRAWL', value: 'False'},
  {name: 'DW_EXTERNAL_LINK_NAMES', value: 'Tellfinder, Google'},
  {
    name: 'DW_EXTERNAL_LINK_VALUES',
    value: 'https://tellfinder.istresearch.com:8443/tellfinder/entitylist.jsp?tip=$VALUE&attribute=false,https://google.com#q=$VALUE'
  },
  {name: 'DW_MOCK_AUTH', value: '1'},
  {name: 'DW_MOCK_FORENSIC_AUTH', value: '1'},
  {name: 'ES_CRED', value: null},
  {name: 'ES_HOST', value: 'els.istresearch.com'},
  {name: 'ES_INDEX', value: 'memex_ht'},
  {name: 'ES_MRPN', value: '10'},
  {name: 'ES_PORT', value: '9200'},
  {name: 'EXTRACTION_BLACKLIST', value: 'www.google.com,search.yahoo.com,www.bing.com,www.yahoo.com'},
  {name: 'MITIE_HOME', value: '/usr/lib/mitie/MITIE'},
  {name: 'PROXY_PORT', value: '8484'}
];
module.exports = function (app) {
  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
  }
  log('Creating dwSettings');
  //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
  app.models.DwSetting.getDataSource().setMaxListeners(32);
  nameValuePairs.forEach(function (item) {
    dwSettingFindOrCreate(app, item.name, item.value);
  });
};
