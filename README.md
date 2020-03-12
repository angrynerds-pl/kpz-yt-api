# Description

API repository for YouTube Extension project for KPZ. 

## Building the app

```bash
# build deep deletion 
$ npm run prebuild

# build app 
$ npm run build

# format source code and tests' code
$ npm run format
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# watch mode with debugger
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test

```bash
# linter
$ npm run lint

# unit tests
$ npm run test

# watch mode
$ npm run test:watch

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e

# debug tests
$ npm run test:debug
```

## Docker

```bash
# production mode - up
$ npm run docker:prod:up

# production mode - down
$ npm run docker:prod:down

# development mode - up
$ npm run docker:dev:up

# development mode - down
$ npm run docker:dev:down

# development mode - attach
$ npm run docker:prod:attach
```

## License

[MIT licensed](LICENSE).
