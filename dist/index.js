/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 859:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 367:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 722:
/***/ ((module) => {

module.exports = eval("require")("fs-extra");


/***/ }),

/***/ 317:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(859);
const github = __nccwpck_require__(367);
const fs = __nccwpck_require__(722);
const { execSync } = __nccwpck_require__(317);

async function run() {
  try {
    // Get inputs
    const versionFilePath = core.getInput('version-file');
    const outputFilePath = core.getInput('output-file');
    
    // Get current date and time in ISO format
    const buildDate = new Date().toISOString();
    
    // Get branch name using git command
    let branch = '';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    } catch (error) {
      core.warning(`Unable to get branch name: ${error.message}`);
      branch = github.context.ref.replace('refs/heads/', '');
    }
    
    // Get version from VERSION file or default to 0.0.0
    let version = '0.0.0';
    try {
      if (await fs.pathExists(versionFilePath)) {
        version = (await fs.readFile(versionFilePath, 'utf8')).trim();
        core.info(`Read version ${version} from ${versionFilePath}`);
      } else {
        core.info(`Version file ${versionFilePath} not found, using default version ${version}`);
      }
    } catch (error) {
      core.warning(`Error reading version file: ${error.message}`);
    }
    
    // Create build info object
    const buildInfo = {
      buildDate,
      branch,
      version
    };
    
    // Write to output file
    await fs.writeJson(outputFilePath, buildInfo, { spaces: 2 });
    
    core.info(`Build info generated at ${outputFilePath}`);
    core.info(`Content: ${JSON.stringify(buildInfo, null, 2)}`);
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
module.exports = __webpack_exports__;
/******/ })()
;