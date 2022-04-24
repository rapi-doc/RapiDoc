## Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.
- **DO NOT** include files inside `dist` directory.
- Rebase before creating a PR to keep commit history clear.
- Make sure that running `yarn build` output do not emit any warnings or errors

### When adding/modifying/renaming any attribute method or event 
  **MUST HAVE**
  - Must be supported with an issue and provide little description about it, including the name, allowed values, defaults etc
  - Add relevant documentation in `./docs/api.html`
  
  **NICE TO HAVE**
  - If adding new dependency, be considerate of the bundle size since we bundle everything in a single file (`rapidoc-min.js`), like to keep its size down
  - It is a good idea to show case it using an example  
    - examples go under `./docs/examples` folder
    - if your example is using a new spec then add in `./docs/specs` folder
    - include a reference to the example  in `./docs/list.html` file

## Prerequisites
`Node 10.15.3+` and `yarn 1.22.4+` and `npm 6.14.4+` are required. Note: we use yarn to lock dependency versions, so you should install dependencies using `yarn` instead of `npm`.

For development 
```shell
git clone https://github.com/rapi-doc/RapiDoc.git
yarn install
yarn serve
# open http://localhost:8080
```

To Generate Production bundle:
```shell
yarn build
# yarn build_windows (if you use windows)
```
