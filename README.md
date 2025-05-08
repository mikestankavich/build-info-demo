# Build Info Generator

A GitHub Action that creates or updates a `build.json` file containing:
- Build date/time (in ISO format)
- Branch name
- Semantic version (from VERSION file if it exists, defaults to 0.0.0)

## Usage

Add this action to your workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate build info
        uses: mikestankavich/build-info-demo@v1
        with:
          # Optional: path to VERSION file (defaults to 'VERSION')
          version-file: 'VERSION'
          # Optional: output JSON path (defaults to 'build.json')
          output-file: 'build.json'
```

## Outputs

The action creates or updates a JSON file with the following structure:

```json
{
  "buildDate": "2023-06-01T12:34:56Z",
  "branch": "main",
  "version": "1.2.3"
}
```

## Requirements

- The checkout action must be run before this action to access git information
- If using a VERSION file, ensure it contains only the version string (e.g., "1.2.3")

## Development

This is a JavaScript-based GitHub Action.

### Dependencies

- @actions/core: Core GitHub Actions functionality
- @actions/github: GitHub API functionality
- fs-extra: Enhanced file system operations

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Make changes to `index.js`

### How It Works

The action:
1. Reads inputs for version file path and output file path
2. Gets the current date in ISO format
3. Retrieves the current branch name using Git commands
4. Reads the version from the specified file or defaults to "0.0.0"
5. Creates a JSON object with this information
6. Writes the JSON to the specified output file