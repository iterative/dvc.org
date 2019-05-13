# Contributing to the Documentation

We welcome any contributions to our documentation repository,
[dvc.org](https://github.com/iterative/dvc.org).

## How to suggest a change

Excluding very trivial changes, all contributions should be connected to an
existing issue.

Please search the [issue tracker](https://github.com/iterative/dvc.org/issues)
before creating a new issue. Issue can be for example about typographical
errors, required updates to the documentation, etc.

We'd like to encourage you to try and fix the issue yourself! Please read the
sections below to learn how to submit your changes.

## Structure of the project

- [Content](https://github.com/iterative/dvc.org/tree/master/static/docs)
  (`/static/docs`) - Markdown files of the different pages to render dynamically
  in the browser.

- [Images](https://github.com/iterative/dvc.org/tree/master/static/img)
  (`/static/img`) - add new images, gifs, svgs, etc here. Reference them from the
  Markdown files like this: `![](/static/img/reproducibility.png)`.

- [Sections](https://github.com/iterative/dvc.org/tree/master/src/Documentation/sidebar.json)
  (`.../sidebar.json`) - edit it to register a new section for the navigation
  menu.

Merging the appropriate changes to these files into the master branch is enough
to update the docs and redeploy the website.

## Development environment

It's highly recommended to run the Node.js docs app locally to test significant
changes to the docs before submitting them, and its very much needed in order to
make changes to the docs JavaScript engine itself (rare). To do so, please
follow the steps below:

- Get the latest development version by
  [forking](https://help.github.com/en/articles/fork-a-repo) and cloning the
  repo from GitHub:
  ```dvc
      $ git clone git@github.com:<username>/dvc.org.git
  ```
- Make sure you have the latest version of [Node.js](https://nodejs.org/en/)
  installed.
- Install the dependencies by running the command `npm install`.
- Start the development server using `npm run dev` which will start the server
  on the default port `3000`.
- Visit `http://localhost:3000/` and navigate to the docs in question.

## Submitting changes

In case of a minor change, you can use the **Edit on Github** button (found to
the right of each page) to fork the project, edit it in place, and create a pull
request (PR).

Otherwise, please refer to the following procedure:

- Find or open a new issue in the [issue
  tracker](https://github.com/iterative/dvc.org/issues).
- Setup the [development environment](#development-environment) explained above.
- Format the code by following the [code style guidelines](#code-style-guidelines) below.
- Auto-format any JS code changes by running `npm run prettier-src`.
- Commit and push the changes to your fork of
  [dvc.org](https://github.com/iterative/dvc.org.git).
- Please follow the [commit style guidelines](#commit-style-guidelines)

We will review your PR as soon as possible. Thank you for contributing!

## Code style guidelines

- No trailing whitespaces are allowed.
- Content must be properly formatted at 80 symbols width. We recommend using
  Visual Studio Code and the
  [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  plugin to format the content.
- Using `dvc <command>` in the documentation will create a link to that command
  automatically.
- Syntax highlighting in fenced code blocks should have 4 spaces indentation and
  support the `usage` and `dvc` custom languages.
  + `usage` is employed to show `dvc help` commands output in each command
    reference doc.
  + `dvc` can be used to show `.dvc` file contents, or examples of console
    commands and their output.
  
  > Check out any of the command reference `.md` source code to get a better
  > idea.

## Commit style guidelines

Format:

```
    (short description)

    (long description)

    Fixes #(github issue id).
```

Example:

```
    Add documentation for `dvc version` command

    Fixes #123
```
