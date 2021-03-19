# Changelog

## v1.0.0 - Initial Release - 2019-07-24

This is the initial release version. The code has been thoroughly tested with 100% coverage.

## v1.1.0 - DevOps improvements / Improve internal class logging - 2021-03-14

- Migrate to GitHub Actions for build and testing - away from Travis CI.
- Use Node based tools for file management (`rimraf`) and update build process and `package.json` scripts to conform with new standards set in [`codemgr`](https://github.com/acmeframework/codemgr) tool.

### Fixes

- v1.1.1 - Fix GitHub Action for publishing to NPM. Correct `release` event `types` key misspelling
