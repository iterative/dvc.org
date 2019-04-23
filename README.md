![owl logo](https://dvc.org/static/img/logo-github-readme.png)

[DVC](https://github.com/iterative/dvc) project documenation and website source
code.

# Documentation

Documentation engine was built using React, react Markdown library, Algolia to
aprovide the full text search. Motivation for bulding it from scratch was lack of
flexibility (customization, sidebar tuning) and ads in engines like
readthedocs, docsify, etc.

Please, feel free to use it for your own sites and
[reach us out](https://dvc.org/support) if you have any questions.

# Contributing

We welcome contributions to DVC by the community!

If you want to fix a type or do a minor change a specific documenation page, please
use the **Edit on Github** button (at the left of the page) to fork the project,
edit it in place and create a PR. Alternatively, create a fork, clone, edit it with
your regular editor and submit a PR to the master branch. We'll review and merge it
as soon as possible. Thank you!

**If you need help:**

If you have any questions, please joint the [community](https://dvc.org/chat) and
use the `#dev-docs` channel to discuss any website and docs related issues. We are
very responsive and happy to help.

**Whereabouts:**

* [Content](https://github.com/iterative/dvc.org/tree/master/static/docs) - 
static Markdown files that are rendered dynamically in the browser. Merging
changes to these files into the master branch is enough to update the docs and
redeploy the website.

* [Media](https://github.com/iterative/dvc.org/tree/master/static/img) - add
new images, gifs, diagrams here. Reference them from the Markdown files like
this: `![](/static/img/reproducibility.png)`.

* [Sections](https://github.com/iterative/dvc.org/tree/master/src/Documentation/sidebar.json) -
edit it to registre a new section with the navigation menu.

**Guidelines:**

We treat the documenation as code and use code style conventions:

* No trailing whitespaces are allowed.
* Content must be properly formatted at 80 symbols width. We recommend using
  Visual Studio Code and the
  [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
  plugin to format the content.
* Use `dvc command` in the documentation to highlight and create a link to the
  command.
* Use `dvc` and `usage` custom code block syntax highlighter specifications to
  highlight DVC, git and CLI syntax properly. Check one of the command references
  to get an idea.

# Copyright

This project is distributed under the Apache license version 2.0 (see the
LICENSE file in the project root).

By submitting a pull request for this project, you agree to license your
contribution under the Apache license version 2.0 to this project.

If you use images, please make a reference to the original site.

