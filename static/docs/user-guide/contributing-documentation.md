# Contributing to the Documentation

We welcome any contributions to [DVC.org](https://github.com/iterative/dvc.org).

## How to suggest a change

Excluding very trivial changes, all contributions should be connected to an
existing issue.

Please search the [issue tracker](https://github.com/iterative/dvc.org/issues)
before creating a new issue. This issue can be about a typographical error, an
updation of the documentation or simply an improvement in generation of
documentation.

If you want to fix or implement it, please read a few paragraphs below to learn
how to submit your changes.

## Structure of the project

* [Content](https://github.com/iterative/dvc.org/tree/master/static/docs) -
  static Markdown files that are rendered dynamically in the browser. Merging
  changes to these files into the master branch is enough to update the docs and
  redeploy the website.

* [Media](https://github.com/iterative/dvc.org/tree/master/static/img) - add new
  images, gifs, diagrams here. Reference them from the Markdown files like this:
  `![](/static/img/reproducibility.png)`.

* [Sections](https://github.com/iterative/dvc.org/tree/master/src/Documentation/sidebar.json) - 
  edit it to register a new section with the navigation menu.

## Submitting changes

In case of a minor change, you can use the **Edit on Github** button (at the
left of the page) to fork the project, edit it in place and create a PR.
Alternatively, create a fork, clone, edit it with your regular editor and submit
a PR to the master branch. We'll review and merge it as soon as possible.

Otherwise, please refer to the following procedure:

* Open a new issue in the [issue
  tracker](https://github.com/iterative/dvc.org/issues).
* Setup the [development environment](#development-environment).
* Fork [DVC.org](https://github.com/iterative/dvc.org.git) and prepare necessary
  changes by referring to [structure of project](#structure-of-the-project).
* Format the code by following the [code style guide](#code-style-guide).
* Format JavaScript code styles by running `npm run prettier-src`.
* Submit a pull request, referencing any issues it addresses.

We will review your pull request as soon as possible. Thank you for
contributing!

## Development environment

To submit your changes in the documentation, you will first need to setup the
development environment of the project.

* Get the latest development version. Fork and clone the repo using one of the
  following methods:

  1. Using HTTPS
  ```dvc
      $ git clone https://github.com/<username>/dvc.org.git
  ```
  2. Using SSH
  ```dvc
      $ git clone git@github.com:<username>/dvc.org.git
  ```
* Make sure you have the latest version of node and npm installed.
* Install the dependencies by running the command `npm install`.
* [Run the development server](#run-the-development-server).

## Run the development server

* Start the development server using `npm run dev` which will start the server
  at port `3000`.
* Visit `http://localhost:3000/`, where the site is being served.

## Commit style guide

Format:

```
  (short description)

  (long description)

  Fix #(github issue id).
```

Example:

```
  Add documentation for `dvc version` command

  Fix #307
```

## Code style guide

* No trailing whitespaces are allowed.
* Content must be properly formatted at 80 symbols width. We recommend using
  Visual Studio Code and the
  [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  plugin to format the content.
* Use `dvc command` in the documentation to highlight and create a link to the
  command.
* Use `dvc` and `usage` custom code block syntax highlighter specifications to
  highlight DVC, git and CLI syntax properly and change
  `/src/Documentation/Markdown/lang/dvc.js` and
  `/src/Documentation/Markdown/lang/usage.js` accordingly. Check one of the
  command references to get an idea.
