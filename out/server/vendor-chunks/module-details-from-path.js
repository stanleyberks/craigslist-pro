"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/module-details-from-path";
exports.ids = ["vendor-chunks/module-details-from-path"];
exports.modules = {

/***/ "(instrument)/./node_modules/module-details-from-path/index.js":
/*!********************************************************!*\
  !*** ./node_modules/module-details-from-path/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar path = __webpack_require__(/*! path */ \"path\")\n\nmodule.exports = function (file) {\n  var segments = file.split(path.sep)\n  var index = segments.lastIndexOf('node_modules')\n  if (index === -1) return\n  if (!segments[index + 1]) return\n  var scoped = segments[index + 1][0] === '@'\n  var name = scoped ? segments[index + 1] + '/' + segments[index + 2] : segments[index + 1]\n  var offset = scoped ? 3 : 2\n  return {\n    name: name,\n    basedir: segments.slice(0, index + offset).join(path.sep),\n    path: segments.slice(index + offset).join(path.sep)\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vbm9kZV9tb2R1bGVzL21vZHVsZS1kZXRhaWxzLWZyb20tcGF0aC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWixXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcmFpZ3NsaXN0LWFsZXJ0LXByby8uL25vZGVfbW9kdWxlcy9tb2R1bGUtZGV0YWlscy1mcm9tLXBhdGgvaW5kZXguanM/YjE4YiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlsZSkge1xuICB2YXIgc2VnbWVudHMgPSBmaWxlLnNwbGl0KHBhdGguc2VwKVxuICB2YXIgaW5kZXggPSBzZWdtZW50cy5sYXN0SW5kZXhPZignbm9kZV9tb2R1bGVzJylcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuXG4gIGlmICghc2VnbWVudHNbaW5kZXggKyAxXSkgcmV0dXJuXG4gIHZhciBzY29wZWQgPSBzZWdtZW50c1tpbmRleCArIDFdWzBdID09PSAnQCdcbiAgdmFyIG5hbWUgPSBzY29wZWQgPyBzZWdtZW50c1tpbmRleCArIDFdICsgJy8nICsgc2VnbWVudHNbaW5kZXggKyAyXSA6IHNlZ21lbnRzW2luZGV4ICsgMV1cbiAgdmFyIG9mZnNldCA9IHNjb3BlZCA/IDMgOiAyXG4gIHJldHVybiB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBiYXNlZGlyOiBzZWdtZW50cy5zbGljZSgwLCBpbmRleCArIG9mZnNldCkuam9pbihwYXRoLnNlcCksXG4gICAgcGF0aDogc2VnbWVudHMuc2xpY2UoaW5kZXggKyBvZmZzZXQpLmpvaW4ocGF0aC5zZXApXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(instrument)/./node_modules/module-details-from-path/index.js\n");

/***/ })

};
;