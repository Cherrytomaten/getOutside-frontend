## GetOutside frontend Nextjs Project

An App for outside adventures! GetOutside is live, heck it out now [here](https://www.get-outside-app.de) yourself!

## Table of Contents

1. [Getting started](#getting-started)
2. [Deployment](#deployment)
3. [Task distribution](#task-distribution)
4. [Roadmap](#roadmap)


### Getting started

To test our project locally instead on our deployed domain follow these steps:
1. Get the repository. We recommend the easiest way, which is cloning the current main branch of this repository directly into your personal directory with:<br/>
`$ git clone https://github.com/Cherrytomaten/getOutside-frontend`
2. Once the repository is cloned, there will be a `package.json` file in the root of the project, containing all information regarding of the dependencies of this project.<br/> It should be noticed that this project requires [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) to be runned, as we disabled npm by choice. For further information about the projects dependencies, take a look at the [package.json](https://github.com/Cherrytomaten/getOutside-frontend/blob/main/package.json).
3. Navigate to the projects directory and run `yarn install` to install all necessary dependencies.
4. Now the project can be launched with `yarn start`.
5. The default url/port is `localhost:3000`

### Deployment

#### Repository structure

In this repository we follow the **Git Feature Branch Workflow**.<br/>
This has several advantages for the workflow in our team:

> The core idea behind the "Feature Branch Workflow" is that all feature development should take place in a dedicated branch instead of the main branch. This encapsulation makes it easy for multiple developers to work on a particular feature without disturbing the main codebase. It also means the main branch will never contain broken code, which is a huge advantage for continuous integration environments.
> <br/> [Further information](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)

The Feature Branch Workflow assumes a central repository, and main represents the official project history. Instead of committing directly on their local main branch, developers create a new branch every time they start working on a new feature. Feature branches should have descriptive names, e.g. <b>feature/</b>animated-menu-items. The idea is to give a clear, highly-focused purpose to each branch.<br/><br/>
In addition, feature branches are pushed to the **develop** branch first. This makes it possible to share a feature with other developers without touching any official code. After a feature branch was approved inside a pull-request and merged into develop, the feature branch will be deleted, to keep the repository clean.
<br/><br/>
Once a bigger feature is finished and all necessary feature branches are merged into develop, the develop branch will be merged into main. Every merge on main counts as new version of our project.

### Task distribution
#### We have 3 developers working on the frontend:
- **Adham**<br/>
  - Who is responsible for testing finalized feature branches on bugs or inconvenient implementations.
  - Initializing new frontend routes and set up the base for it to be picked up by Leon or Marlon for further altering and adjustments.
  - Fetching proper demo data.
- **Leon**<br/>
   - Who connects frontend routes, that were using mock data with actual backend API routes
   - Adds default components like the pinpoint page or profil page.
   - Tests new features on bugs
   - Reviews pull-requests by Marlon
- **Marlon**<br/>
   - Who is responsible for the frontend managing, which includes: distributing tasks, keeping in touch with the backend, plan on how to implement new features with the current code structure, reviewing pull-requests and maintaining the frontend repository.
   - Adds complex features like the authentication frame
   - Adds API frontend proxy API routes ([Nextjs proxy API](https://nextjs.org/docs/api-routes/introduction))
   - polishes code structure
   - polishes design of components
   - Providing workshops / support for *nextJs/TypeScript/server data fetching* to the team

**All tasks are documented in our ticket system on linear [here](https://linear.app/cherrytomaten/project/getoutside-78a479cfd135)**

### Roadmap
Following features are still **work in progress**:
- user forgot password (missing API backend)
- favorites page (design polish)
- user page (missing some features to change more user data)
- Add pinpoints
- Add comments
- Rate a spot
- Show multiple images on one pinpoint

### Planned features
- User can show that they're currently at a specific spot, so other users can see how many people are at one spot.
