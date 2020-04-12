# Contributing to the Documentation

We welcome any contributions to our documentation repository,
[dvc.org](https://github.com/iterative/dvc.org). Contributions can be updates to
the documentation content, or (rare) changes to the JS engine we use to run the
website.

## Structure of the project

To contribute documentation, these are the relevant locations:

- [Content](https://github.com/iterative/dvc.org/tree/master/content/docs)
  (`docs/`): [Markdown](https://guides.github.com/features/mastering-markdown/)
  files of the different pages to render dynamically in the browser.
- [Images](https://github.com/iterative/dvc.org/tree/master/static/img)
  (`img/`): Add new images (png, svg, etc.) here. Use them in Markdown files
  like this: `![](/img/<filename>.gif)`.
- [Navigation](https://github.com/iterative/dvc.org/tree/master/content/docs/sidebar.json)
  (`docs/sidebar.json`): Edit it to add or change entries in the navigation
  sidebar.

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

## Installation

Make sure you have the latest LTS version of [Node.js](https://nodejs.org) and
[Yarn](https://yarnpkg.com) installed.

Run `yarn`.

## Commands

- `yarn develop` - run dev server with hot reload.
- `yarn build` - build static assets to `public` folder.
- `yarn serve` - run static server over the `public` folder content to check
  build results.
- `yarn lint-ts` - lint `.ts` and `.tsx` for compilance with code style and
  check its for type errors.
- `yarn lint-css` - lint `.css` files for compilance with code style.

## ENV variables

- `GA_ID` – id of the Google Analytics counter.
- `ANALYZE` - boolean prop to run webpack-analyzer
- `SENTRY_DSN` - sentry dsn url for tracking errors

## Development environment

We highly recommend running this web app locally to check documentation changes
before submitting them, and it's quite necessary when making changes to the
[Next.js](https://nextjs.org/) engine itself (rare). Source code files need to
be properly formatted as well, which is also ensured by the full setup below.

Get the latest development version by
[forking](https://help.github.com/en/articles/fork-a-repo) and cloning the
repository from GitHub:

```dvc
$ git clone git@github.com:<username>/dvc.org.git
$ cd dvc.org
```

Make sure you have a recent version of [Node.js](https://nodejs.org/en/)
(`^12.0.0`), and install [Yarn](https://yarnpkg.com/):

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

This will start the server on the default port, `3000`. Visit
`http://localhost:3000/` and navigate to the docs in question. This will also
enable the Git pre-commit hook that will be formatting your code and
documentation files automatically.

### Debugging

The `yarn debug` script runs the local development server with `node`'s
[`--inspect-brk` option](https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options)
in order for debuggers to connect to it (on the default port, 9229).

> For example, use this launch configuration in **Visual Studio Code**:
>
> ```json
> {
>   "type": "node",
>   "request": "launch",
>   "name": "Launch via Yarn",
>   "runtimeExecutable": "yarn",
>   "runtimeArgs": ["debug"],
>   "port": 9229
> }
> ```

### Running tests

If you intend to change JavaScript (Node) files, test the changes with
`yarn test` command before committing them. For code formatting and styling, try
`yarn format-staged` and `yarn lint`. (All of these checks will be enforced
automatically upon [submitting PRs](#submitting-changes).)

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
  hook. You may also run `yarn format <file>` (format specific file/pattern),
  `yarn format-staged` (all staged files), or `yarn format-all` (all .md, .js
  files) before committing changes if needed.
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
