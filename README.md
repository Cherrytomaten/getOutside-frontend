## Nextjs project skeleton

This repository includes a base for a nextjs project based on typescript.
Just change the name of the project in the package.json and you're good to go.

## How to use
1. Navigate to your desired folder and clone the repository 
```sh
git clone https://github.com/MarlonAACN/nextjs-project-skeleton.git YOUR_PROJECT_NAME
```
2. Run `yarn install inside your cloned project
3. Change the `"name"` attribute inside the package.json to your projects name

### Included libraries

- tailwindCSS
- eslint
- eslint tailwind classname order plugin

### Notable mentions

- This project is supposed to be run with yarn
- The tsconfig.json is changed to personal preferences, i.a. adding a baseUrl path
- VsCode formatting settings are included
- On every git commit, the code is automatically formatted by prettier & eslint
