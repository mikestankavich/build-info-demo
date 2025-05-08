const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs-extra');
const { execSync } = require('child_process');

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