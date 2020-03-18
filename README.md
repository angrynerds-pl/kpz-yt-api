# Description

API repository for YouTube Extension project for KPZ.

## Running tests from docker

```bash
$ npm run docker:dev:up
$ npm run docker:dev:attach
/app # npx jest --watch # and other options if needed
```

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

## Swagger

Swagger runs on `/api`. And that's it :smile:.

## Docs

Docs are compiled using latex. Vscode's extension `Latex Workshop` is configured in `.vscode/settings.json` file. Make sure to have `latexmk` and `pdflatex` available from `PATH`.
It is recommended to compile docs using texlive and have installed following packages:

- texlive
- texlive-science
- texlive-latex-recommended
- texlive-latex-extra
- texlive-latex-base
- texlive-lang-polish
- texlive-extra-utils
- latexmk

## License

[MIT licensed](LICENSE).
