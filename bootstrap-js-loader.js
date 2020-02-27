module.exports = function (source) {
  source = updater(source, new RegExp('(?<=ClassName \= \{)(.*?)(?=\s*\})', 'gms'), new RegExp('(?<=\')([a-zA-Z][a-zA-Z0-9-_]+)(?=\s*\')', 'gms'), 'mwz-$1')

  var isolateSelector = new RegExp('(?<=Selector \= \{)(.*?)(?=\s*\})', 'gms')

  source = updater(source, isolateSelector, /\.([a-zA-Z][a-zA-Z0-9-_]+[a-zA-Z0-9-_]*)/g, '.mwz-$1')
  source = updater(source, isolateSelector, /data-toggle="([a-zA-Z0-9-_]+)"/g, 'data-toggle="mwz-$1"')

  source = updater(source, new RegExp('(?<=template: \'<)(.*?)(?=\s*>\',)', 'gms'), /class="([a-zA-Z][a-zA-Z0-9-_]+[a-zA-Z0-9-_]*)"/g, 'class="mwz-$1"')

  source = source.replace(/closest\(\'\.modal\'\)/g, 'closest(\'.mwz-modal\')')
  source = source.replace(/closest\(\'\.navbar\'\)/g, 'closest(\'.mwz-navbar\')')
  // source = updater(source, new RegExp('(?<=closest\\(\'\.)(.*?)(?=\s*\'\\))', 'gms'), /\.([a-zA-Z][a-zA-Z0-9-_]+[a-zA-Z0-9-_]*)/g, '.mwz-$1', true)

  return source;
};

function updater (source, isolate, search, replacer, debug) {
  var matchResult = source.match(isolate);
  if (debug) {
    console.log('isolate', isolate);
    console.log('matchResult', matchResult);
  }

  if (matchResult) {
    var transformedResult = matchResult[0].replace(search, replacer);
    if (debug) {
      console.log('transformedResult', transformedResult);
    }
    source = source.replace(isolate, transformedResult)
  }
  return source
}
