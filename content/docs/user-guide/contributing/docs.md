# Contributing to the Documentation

We welcome any contributions to our documentation repository,
[dvc.org](https://github.com/iterative/dvc.org). Contributions can be updates to
the documentation content, or (rare) changes to the JS engine we use to run the
website.

In case of a minor change, you can use the **Edit on GitHub** button to open the
source code page. Use the Edit button (pencil icon) to edit the file in-place,
and then **Commit changes** from the bottom of the page.

> Please see our
> [Writing a Blog Post guide](https://dvc.org/doc/user-guide/contributing/blog)
> for more details on how to write and submit a new blog post.

## Structure of the project

To contribute documentation, these are the relevant locations:

- [Content](https://github.com/iterative/dvc.org/tree/master/content/docs)
  (`content/docs/`):
  [Markdown](https://guides.github.com/features/mastering-markdown/) files. One
  file — one page of the documentation.
- [Images](https://github.com/iterative/dvc.org/tree/master/static/img)
  (`static/img/`): Add new images (`.png`, `.svg`, etc.) here. Use them in
  Markdown files like this: `![](/img/<filename>.gif)`.
- [Navigation](https://github.com/iterative/dvc.org/tree/master/content/docs/sidebar.json)
  (`content/docs/sidebar.json`): Edit it to add or change entries in the
  navigation sidebar.

Merging the appropriate changes to these files into the master branch is enough
to update the docs and redeploy the website.

## Submitting changes

- Find or open a new issue in the
  [issue tracker](https://github.com/iterative/dvc.org/issues) to let us know
  that you are working on this.

- Format the source code by following the
  [style guidelines](#doc-style-guidelines-javascript-and-markdown) below. We
  highly recommend setting up a
  [development environment](#development-environment) as explained below. Among
  other things, it can help format the documentation and JS code automatically.

- Push the changes to your fork of
  [dvc.org](https://github.com/iterative/dvc.org.git) and submit a PR to the
  upstream repo.

We will review your PR as soon as possible. Thank you for contributing!

## Development environment

We highly recommend running this web app locally to check documentation or blog
changes before submitting them, and it's quite necessary when making changes to
the website engine itself. Source code and content files need to be properly
formatted and linted as well, which is also ensured by the full setup below.

Make sure you have [Python](https://www.python.org/downloads/) 3.7+, a recent
LTS version of [Node.js](https://nodejs.org/en/) (`>=14.0.0`, `<=16.x`), and
install [Yarn](https://yarnpkg.com/):

> In Windows, you may need to install [Visual Studio Build Tools], and the
> [Windows SDK] first.

[windows sdk]:
  https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/
[visual studio build tools]:
  https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019

```dvc
$ npm install -g yarn
```

Having cloned this project locally, navigate into the directory and install the
project dependencies with Yarn:

```dvc
$ yarn
```

Launch the server locally with:

```dvc
$ yarn develop
```

This will start the server on the default port, `8000`. Visit
`http://localhost:8000/` and navigate to the page in question. This will also
enable the pre-commit Git hook that will be formatting and linting your code and
documentation files automatically.

### All commands

These Node scripts are specified in the docs repo's `package.json` file.

To build the project and run it:

- `yarn develop` - run development server with hot reload.
- `yarn build` - build assets in the `public` directory.
- `yarn start` - run production static server over the `public` directory.

> All the tests, formatting, and linters below will be enforced automatically
> upon [submitting PRs](#submitting-changes).

If you change source code files, run tests:

- `yarn test` - run tests.

We use [Prettier](https://prettier.io/) to format our source code. Below is a
set of wrapper commands for your convenience:

- `yarn format-check` - check all source and content files that they are
  properly formatted. This script does not fix any found issue, only reports
  them.
- `yarn format-all` - fix all found problems.
- `yarn format-staged` - same, but only on staged files.
- `yarn format <file>` - run this script `yarn format <file-name>` to format a
  specific file.

We use linters (e.g. [ESLint](https://eslint.org/)) to check source code style
and detect different errors:

- `yarn lint-ts` - lint source code files (`.ts`, `.js`, `tsx`, etc).
- `yarn lint-css` - lint `.css` files.

> Note that you can always use the formatter or linter directly (e.g.
> `yarn eslint <file>` or `yarn prettier --check <file>`).

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

Some of the following rules are applied automatically by a pre-commit Git hook
that is installed when `yarn` runs (see [dev env](#development-environment)).

- No trailing white spaces are allowed.

- Text content must be properly formatted at 80 symbols width.

  > 💡 We recommend using Visual Studio Code with the
  > [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  > plugin for help with this.

- You can see the configuration of our formatter tool (Prettier)
  [here](https://github.com/iterative/dvc.org/blob/master/.prettierrc). You may
  also run the formatting [commands](#all-commands) manually.
  ([Advanced usage](https://prettier.io/docs/en/cli.html) of Prettier is
  available through `yarn prettier ...`)

- Markdown: Using `dvc <command>`, the docs engine will create a link to that
  command automatically. (No need to use `[]()` explicitly to create them.)

- Markdown: Using `dvc.api.<api_method>()` or `dvc.api`, the docs engine will
  create a link to that API method automatically. (No need to use `[]()`
  explicitly to create them.)

- Markdown: Bullet lists shouldn't be too long (5-7 items max., ideally).

- Markdown: The text in each bullet item also shouldn't be too long (3 sentence
  paragraphs max.) Full sentence bullets should begin with a capital letter and
  end in period `.`. Otherwise, they can be all lower case and have no ending
  punctuation. Bullets can be separated by an empty line if they contain several
  paragraphs, but this is discouraged: try to keep items short.

- Markdown: Syntax highlighting in fenced code blocks should use the `usage`
  `dvc`, `dvctable`, `yaml`, or `diff` custom languages.
  - `usage` is employed to show the `dvc --help` output for each command
    reference.
  - `dvc` can be used to show examples of commands and their output in a
    terminal session.
  - `dvctable` is used for creating colored, bold, or italic table cells. (You
    can see an [example](https://dvc.org/doc/start/experiments) of `dvctable` in
    our "Get Started" section.)
  - `yaml` is used to show samples of <abbr>DVC files</abbr>, or other YAML
    contents.
  - `diff` is used mainly for examples of `git diff` output.

> Check out the `.md` source code of any command reference to get a better idea,
> for example in
> [this very file](https://raw.githubusercontent.com/iterative/dvc.org/master/content/docs/user-guide/contributing/docs.md).

## General language guidelines

We try to use a casual and fun tone in our docs. We also avoid authoritative
language such as "As you can see, clearly this is what happened, of course" etc.
which while good-intentioned, may scare readers off.

We prefer general, human-friendly language rather than exact jargon as long as
it's correct. Example: avoid Git jargon such as _revision_ or _reference_,
preferring the more basic terms _commit_ or _version_.

The [command reference](/doc/command-reference) contains some of our most
technical documents where specialized language is used the most, but even there,
we use expandable sections for complex implementation details.

Start by writing the essence in simple terms, and complete it with
clarifications, edge cases, or other precisions in a separate iteration.

We use **bold** text for emphasis, and _italics_ for special terms.

We also use "emoji" symbols sparingly for visibility on certain notes. Mainly:

- 📖 For notes that link to other related documentation
- ⚠️ Important warnings or disclaimers related to advanced DVC usage
- 💡 Useful notes and tips, often related to external tools and integrations

> Some other emojis currently in use here and there: ⚡✅🙏🐛⭐⚙️(ℹ️) (among
> others).
