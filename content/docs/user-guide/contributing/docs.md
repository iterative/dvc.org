# Contributing to the Documentation

We welcome any contributions to our documentation repository,
[dvc.org](https://github.com/iterative/dvc.org). Contributions can be updates to
the documentation content, or (rare) changes to the JS engine we use to run the
website.

Please see our
[Writing a Blog Post guide](https://dvc.org/doc/user-guide/contributing/blog)
for more details on how to write and submit a new blog post.

## Structure of the project

To contribute documentation, these are the relevant locations:

- [Content](https://github.com/iterative/dvc.org/tree/master/content/docs)
  (`content/docs/`):
  [Markdown](https://guides.github.com/features/mastering-markdown/) files. One
  file - one page of the documentation.
- [Images](https://github.com/iterative/dvc.org/tree/master/static/img)
  (`static/img/`): Add new images (`.png`, `.svg`, etc.) here. Use them in
  Markdown files like this: `![](/img/<filename>.gif)`.
- [Navigation](https://github.com/iterative/dvc.org/tree/master/content/docs/sidebar.json)
  (`content/docs/sidebar.json`): Edit it to add or change entries in the
  navigation sidebar.

Merging the appropriate changes to these files into the master branch is enough
to update the docs and redeploy the website.

## Submitting changes

In case of a minor change, you can use the **Edit on GitHub** button (found to
the right of each page) to fork the repository, edit it in place (with the
source code file **Edit** button in GitHub), and create a pull request (PR).

Otherwise, please refer to the following procedure:

- Find or open a new issue in the
  [issue tracker](https://github.com/iterative/dvc.org/issues) to let us know
  that you are working on this.

- Format the code by following the
  [code style guidelines](#code-style-guidelines) below. We highly recommend
  setting up a [development environment](#development-environment) as explained
  below. Among other things, it can help format the documentation and/or JS code
  automatically.

- Push the changes to your fork of
  [dvc.org](https://github.com/iterative/dvc.org.git) and submit a PR to the
  original repository.

We will review your PR as soon as possible. Thank you for contributing!

## Development environment

We highly recommend running this web app to check documentation or blog changes
before submitting them, and it's quite necessary when making changes to the
website engine itself. Source code and content files need to be properly
formatted and linted as well, which is also ensured by the full setup below.

> ⚡ You can create a dev env online using Gitpod (a fully featured online IDE),
> it'll automatically clone the repo, install the dependencies, and run the app
> (takes a few minutes), so that you can start straight away.
>
> <a href="https://gitpod.io/#https://github.com/iterative/dvc.org">
>   <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
> </a>

<details>

### How to make a Pull Request with Gitpod?

- Fork the repo by selecting Find Command from View in the top menu and then
  type fork and press enter:

  ![image](https://user-images.githubusercontent.com/46004116/76392493-75727880-6393-11ea-8939-41e6c36477de.png)

- You can commit your changes either using a the `git` cli or using the GUI in
  the top left tab under search as shown below:

  ![image](https://user-images.githubusercontent.com/46004116/76298550-6fb95c00-62db-11ea-9fda-f4e8c0840e69.png)

- Once you are done commiting your changes you can push the code via using push
  button from the GitHub tab in the top right corner as shown:

  ![image](https://user-images.githubusercontent.com/46004116/76299985-c9228a80-62dd-11ea-930c-00eb22156c9e.png)

- Once you have made all the changes and pushed them to your fork. You can make
  PR from the same GitHub tab in top right corner as shown:

  ![image](https://user-images.githubusercontent.com/46004116/76300458-9036e580-62de-11ea-8f24-ebaa664204ce.png)

</details>

Make sure you have a recent LTS version of [Node.js](https://nodejs.org/en/)
(`>=12.0.0`), and install [Yarn](https://yarnpkg.com/):

```dvc
$ npm install -g yarn
```

Install the project dependencies with Yarn:

```dvc
$ yarn
```

Launch the server locally with:

```dvc
$ yarn develop
```

This will start the server on the default port, `8000`. Visit
`http://localhost:8000/` and navigate to the page in question. This will also
enable the Git pre-commit hook that will be formatting and linting your code and
documentation files automatically.

### All commands

Please, check the project's `package.json` file to see the complete list. For
the tools we provide wrappers for your convenience, you can always call them
directly (e.g. `yarn eslint <file>` or `yarn prettier --check <file>`).

> All the style, linter, test checks below will be enforced automatically upon
> [submitting PRs](#submitting-changes).

To build the project and run it:

- `yarn develop` - run development server with hot reload.
- `yarn build` - build assets in the `public` directory.
- `yarn start` - run production static server over the `public` directory.

If you change source code files, run tests:

- `yarn test` - run tests.

We use [Prettier](https://prettier.io/) to format our source code, below is a
set of wrapper commands for your convenience:

- `yarn format-check` - check all source and content files that they are
  properly formatted. This command does not fix any found issue, only reports
  them.
- `yarn format-all` - fix all found problems.
- `yarn format-staged` - same, but only on staged files.
- `yarn format <file>` - run this command `yarn format <file-name>` to format a
  specific file.

We use linters (e.g. [ESLint](https://eslint.org/)) to check source code style
and detect different errors:

- `yarn lint-ts` - lint source code files (`.ts`, `.js`, `tsx`, etc).
- `yarn lint-css` - lint `.css` files.

### ENV variables

Some environment variables are required to deploy this project to production,
others can be used to debug the project. Please check the production system
settings to see all the variables that production and deployment system depend
on.

Some available variables:

- `GA_ID` – ID of the Google Analytics counter.
- `ANALYZE` - boolean property to run
  [webpack-analyzer](https://www.gatsbyjs.org/packages/gatsby-plugin-webpack-bundle-analyzer/).
- `SENTRY_DSN` - [Sentry](https://sentry.io/) URL for errors tracking.

## Doc style guidelines (JavaScript and Markdown)

The first few of the rules below should be enforced automatically by a Git
pre-commit hook that is integrated when `yarn` installs the project dependencies
(explained above).

- No trailing white spaces are allowed.

- Content must be properly formatted at 80 symbols width.

  > 💡 We recommend using Visual Studio Code with the
  > [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  > plugin for help with this.

- We use [Prettier](https://prettier.io/) to format our source code (see
  [its configuration](https://github.com/iterative/dvc.org/blob/master/.prettierrc)).
  The formatting of staged files will automatically be done by a Git pre-commit
  hook. You may also run the formatting [commands](#all-commands) manually.
  ([Advanced usage](https://prettier.io/docs/en/cli.html) of Prettier is
  available through `yarn prettier ...`)

- Markdown: Using `dvc <command>`, the docs engine will create a link to that
  command automatically. (No need to use `[]()` explicitly to create them.)

- Markdown: Neither bullet lists nor each item's should be too long (3 sentence
  paragraphs max.) Full sentence bullets should begin with a capital letter and
  end in period `.` otherwise they can be all lower case and have no ending
  punctuation. Bullets can be separated by an empty line if they contain several
  paragraphs, but this is discouraged, to keep each item short.

- Markdown: Syntax highlighting in fenced code blocks should use the `usage`
  `dvc`, and `yaml` custom languages. `usage` is employed to show the
  `dvc --help` output for each command reference. `dvc` can be used to show
  examples of commands and their output in a terminal session. `yaml` is used to
  show [DVC-file](/doc/user-guide/dvc-file-format) contents.

> Check out the `.md` source code of any command reference to get a better idea,
> for example in
> [this very file](https://raw.githubusercontent.com/iterative/dvc.org/master/content/docs/user-guide/contributing/docs.md).

## General language guidelines

We try to use a casual and fun tone in our docs. We also avoid authoritative
language such as "As you can see, clearly this is what happened..." which while
good-intentioned, may scare off readers.

We prefer human-friendly language than exact jargon, as long as it's correct,
even if using general terminology. Example: avoid Git jargon such as _revision_
or _reference_, preferring the more basic concept _commit_.

The [command reference](/doc/command-reference) contains some of our most
technical documents where specialized language is used the most, but even there,
we use expandable sections for complex implementation details.

Start by writing the essence in simple terms, and complete it with
clarifications, edge cases, or other precisions in a separate iteration.

We use **bold** text for emphasis, and _italics_ for special terms.

We also use "emoji" symbols sparingly for visibility on certain notes. Mainly:

- ⚠️ Warnings about possible problems related to DVC usage (similar to **Note!**
  and "Note that..." notes)
- 💡 Useful tips related to external tools/integrations

> Some other emojis currently in use here and there: ⚡🙏🐛⭐❗✅ (We're not
> limited to these.)
