module.exports = function (source) {
  var r = /(?!\.png)(?!\.mapwizeui)\.([a-zA-Z][a-zA-Z0-9-_]+\w*)(?=[^\{,\n]*[\{,])/g;
  return source.replace(r, '.mwz-$1');
};
