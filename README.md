# typeorm-data-fixtures
<p align="center">
  <a href="https://github.com/pashak09/typeorm-data-fixtures/actions">
    <image src="https://github.com/pashak09/typeorm-data-fixtures/actions/workflows/test-on-push.yml/badge.svg" alt="test" />
  </a>
  <a href="https://coveralls.io/github/pashak09/typeorm-data-fixtures?branch=main">
    <img src="https://coveralls.io/repos/github/pashak09/typeorm-data-fixtures/badge.svg?branch=main" alt="Coverage Status" />
  </a>
  <a href="https://www.npmjs.com/package/typeorm-data-fixtures">
    <img src="https://img.shields.io/npm/v/typeorm-data-fixtures" alt="npm shield" />
  </a>
</p>

typeorm-data-fixtures provides an easy and consistant way to load test fixtures into a database with TypeORM.

This library provides three constructs:
- **Factory** creates entities with random or partially prepared data.
- **Static fixtures** load entities and data with fixed data when a test suite starts.

Along with these, typeorm-data-fixtures has many features that help us spend more time on writing actual tests.

# Installation
With npm
```bash
npm install --dev typeorm-data-fixtures
```
or with yarn
```bash
yarn add -D typeorm-data-fixtures
```
[TypeORM](https://www.npmjs.com/package/typeorm) is a peer dependency.
`experimentalDecorators` must be set to true in `tsconfig.json`, although this already should have been set if TypeORM is installed.

Examples of usage you can find in <a href="https://github.com/pashak09/typeorm-data-fixtures/tree/master/examples">examples folder</a>

Some code was taken from <a href="https://github.com/jungnoh/typeorm-fixture">here</a>

# License
MIT