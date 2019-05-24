# Contributing to the Documentation

We welcome any contributions to our documentation repository,
[dvc.org](https://github.com/iterative/dvc.org). Contribution can be an update
to the documentation or (rare) updating or fixing the JS engine that we use to
run the website.

## Structure of the project

To contribute documentation you need to know these locations:

- [Content](https://github.com/iterative/dvc.org/tree/master/static/docs)
  (`/static/docs`) -
  [Markdown](https://guides.github.com/features/mastering-markdown/) files of
  the different pages to render dynamically in the browser.

- [Images](https://github.com/iterative/dvc.org/tree/master/static/img)
  (`/static/img`) - add new images, gif, svg, etc here. Reference them from the
  Markdown files like this: `![](/static/img/reproducibility.png)`.

- [Sections](https://github.com/iterative/dvc.org/tree/master/src/Documentation/sidebar.json)
  (`.../sidebar.json`) - edit it to register a new section for the navigation
  menu.

Merging the appropriate changes to these files into the master branch is enough
to update the docs and redeploy the website.

## Submitting changes

In case of a minor change, you can use the **Edit on Github** button (found to
the right of each page) to fork the project, edit it in place (check the right
top corner for an Edit button on Github), and create a pull request (PR).

Otherwise, please refer to the following procedure:

- Find or open a new issue in the
  [issue tracker](https://github.com/iterative/dvc.org/issues) to let us know
  that you are working on this.
- Format the code by following the
  [code style guidelines](#code-style-guidelines) below. It's highly recommended
  setup the [development environment](#development-environment) explained above.
  It can help you to format your the documentation and/or JS engine files
  automatically. Otherwise, we recommend using the Visual Studio Code and the
  [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  plugin to format the content of Markdown files.
- Push the changes to your fork of
  [dvc.org](https://github.com/iterative/dvc.org.git) and create a PR to the
  original repository.

We will review your PR as soon as possible. Thank you for contributing!

## Development environment

It's highly recommended to install the pre-commit hook that prettifies the files
for you automatically before you push them:

- Get the latest development version by
  [forking](https://help.github.com/en/articles/fork-a-repo) and cloning the
  repository from GitHub:

```dvc
$ git clone git@github.com:<username>/dvc.org.git
```

- Make sure you have Python 3.6 or higher installed. It will be required to run
  style checkers on pre-commit. On Mac OS, use `brew` to install the latest
  version of Python.

- We **strongly** recommend initializing a
  [virtual environment](https://virtualenv.pypa.io/en/latest/userguide/) before
  installing the required libraries for style checkers. Follow the instructions
  to create one:

```dvc
$ cd dvc.org
$ virtualenv --python python3 .env
$ source .env/bin/activate
```

- Install the style checker's requirements using
  `pip install -r requirements.txt`.

- Install coding style pre-commit hook with `pre-commit install`.
- Once the `pre-commit` hook is installed, you may deactivate the virtual
  environment by running `deactivate`.

It's highly recommended to run the Node.js docs app locally to test significant
changes to the docs before submitting them, and its very much needed in order to
make changes to the docs JavaScript engine itself (rare). To do so, please
follow the steps below:

- Make sure you have the latest version of [Node.js](https://nodejs.org/en/)
  installed. Install and keep the dependencies up to date by running
  `npm install` often.

- Start the development server using `npm run dev` which will start the server
  on the default port `3000`.

- Visit `http://localhost:3000/` and navigate to the docs in question.

## Code style guidelines

- **Markdown and JS files:** no trailing whitespaces are allowed.

- **Markdown and JS files:** content must be properly formatted at 80 symbols
  width. We recommend using Visual Studio Code and the
  [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  plugin to format the content of Markdown files or install the pre-commit hook
  described above.

- **Markdown and JS files:** we use `prettier` default conventions to format our
  files. It's highly recommended to install the hook or run `prettier` manually
  before submitting the pull request.

- Using `dvc <command>` in the documentation will create a link to that command
  automatically. No need to use `[]()` explicitly to create them.

- Syntax highlighting in fenced code blocks should use the `usage` and `dvc`
  custom languages:

- `usage` is employed to show `dvc help` commands output in each command
  reference doc.
- `dvc` can be used to show `.dvc` file contents, or examples of console
  commands and their output.

> Check out any of the command reference `.md` source code to get a better idea.
