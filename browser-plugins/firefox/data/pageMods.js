var {pluginState} = require('./pluginState');
exports.init = function () {
  var pageMod = require('sdk/page-mod');
  try {
    pageMod.PageMod({
      include: '*',
      exclude: pluginState.pageModDatawakeDepotIncludeFilter,
      contentScriptFile: [
        './vendor/jszip/jszip.min.js',
        './vendor/jquery/jquery-2.1.4.min.js',
        './injectedPageScripts/scraper.js'],
      attachTo: ['existing', 'top', 'frame'],
      onAttach: pluginState.onScraperContentScriptAttach
    });
  }
  catch (err) {
    console.log(err);
  }
  try {
    pageMod.PageMod({
      include: pluginState.pageModDatawakeDepotIncludeFilter,
      contentScriptFile: './injectedPageScripts/datawake-depot.js',
      attachTo: ['existing', 'top', 'frame'],
      onAttach: pluginState.onDatawakeDepotContentScriptAttach
    });
  }
  catch (err) {
    console.log(err);
  }
};
