## GetOutside frontend Nextjs Project
#### Please use the following flow structure to commit to this repo:
1. Checkout the develop branch, if you're not already on this branch<br/>
`git checkout develop`<br/>
2. Now you can create your personal feature branch from that with<br/>
`git checkout -b YOUR_BRANCH_NAME`
The `-b` attribute means that git creates a new branch if one with this exact name doesn't exist already.<br/>
   (You can also combine these two steps with `git checkout -b YOUR_BRANCH_NAME develop`)<br/>
3. After you finished your Feature do a pull request to get approval of your changes before your code is merged into the dev branch
Please follow a clean pull request structure.

## Pull request structure
There must be a title in this format: `Feature|Bugfix|Hotfix|Release: Title`","- If applicable, add your issue ticket (e.g. `A-100`) with a slash in the title (Feature/A-100: Title)","- Use `Feature` for enhancements or new functionality","- Use `Bugfix` only if you fixed a known bug","- Use `Hotfix` for problems introduced by previous merges","- Use proper capitalization in your title"]'
Please also always provide a short description, explaining your changes.
An example for a good pr title would be: 'Feature: Setup Server connection'
When your pull request has the desired structure, the pr will automatically be labeled with the `Good structure` tag. Requests without this label
will be ignored until a proper format is provided.

## Pull request approval
After your request, atleast one or more members have to check out your code and approve it. If a developer finds an error or has some sort of
misunderstanding, they can comment on certain code passages and instead of approving the pr, the author will be requested to make changes to his code
before the pr gets approved.

## Merge approved request
After a request has been approved, it's always the 'honor' of the original author to merge the pr into the branch. Please use 'squash and merge' for
your merge. The default title can be kept as such but please remove the optional description.
