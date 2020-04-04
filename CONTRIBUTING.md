## Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.
- **DO NOT** include files inside `dist` directory.
- Rebase before creating a PR to keep commit history clear.
- Make sure that running `yarn build` output do not emit any warnings or errors
- Be considerate of the bundle size, we bundle everything in a single bundle `rapidoc-min.js`.

**IMPORTANT**
- If you are adding/modifying/renaming any attribute method or event then 
  - First creating an issue and provide little description about it, including the name, allowed values, defaults etc
  - If you are trying to include any new dependency then mention before and after size of `rapidoc-min.js`
  - In you PR add relevant documentation in `./docs/api.html`
  - It is a good idea to show case it using an example 
  - add the example under `./docs/examples` folder
  - if your example is using a new spec then add in under `./docs/specs` folder
  - include a reference to the example  in `./docs/list.html`

## Prerequisites
`Node 10.15.3+` and `yarn 1.22.4+` and `npm 6.14.4+` are required. Note: we use yarn to lock dependency versions, so you should install dependencies using `yarn` instead of `npm`.

For development 
```shell
git clone https://github.com/mrin9/RapiDoc.git
yarn install
yarn serve
# open http://localhost:8080
```

To Generate Production bundle:
```shell
yarn build
# yarn build_windows (if you use windows)
```
