# Retyped SES

This folder contains retyped versions of some of the SES modules to aid with the discussions in deciding on the best path forward.

This is all still a work in progress just to get some discussions going.

## What to keep in mind…

- **Do not merge**… I butchered your code.
- JavaScript is the source of truth and `jsconfig.json` ensures this.
- Type generation is necessary since for consumer-facing types.
  - TypeScript-based language services are the immediate focus.
  - JSDoc-based language services are not the immediate focus.

## What to do…

Open `endo/retyped` in a new vscode window and run `yarn`, then manually inspect the files inside the packages and modules subfolders in `endo/retyped/packages/*/test`.

The `build:types` package script must be used to update the `types.d.ts` in the root of each package which can theoretically be run as a `post-install` hook by consumers, but it is not that simple.

## What to look for…

### endo/packages/ses

- endo/packages/ses/package.json
  - scripts
    - lint:types
  - devDependencies
    - tsd
    - typescript
- endo/packages/ses/index.d.ts
- endo/packages/ses/index-test.d.ts

### endo/retyped/packages/retyped-ses

- endo/retypes/packages/retyped-ses/src/error/internal/*
- endo/retypes/packages/retyped-ses/test/modules/*
- endo/retypes/packages/retyped-ses/test/packages/*/*
