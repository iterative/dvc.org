# Writing Blog Posts

To create a new post, you need to create a PR to the DVC website
[project](https://github.com/iterative/dvc.org).

## Prepare your environment

Set up the
[Development environment](/doc/user-guide/contributing/docs#development-environment)
to see how your content will look like after you publish it. The `yarn author`
command will build a subset of the website with only the latest blog post, while
`yarn develop` lets you preview the whole site at the cost of a longer build
time. Both commands start up a development server which will continue to update
as you add new content.

## Add a post

Create a Markdown file in the `content/blog` folder. The file name must follow
this pattern: `YYYY-MM-DD-my-post-title.md`. After merging this file into the
`master` branch, the blog post will be published at `/blog/my-post-title`
automatically.

Write front matter in the following format:

```yaml
---
title: Hello World
date: 2015-05-01
description: Hello World
descriptionLong: |
  Some long
  multiline
  text (supports _basic_ [Markdown](link))
picture: 2015-05-01/post-image.jpeg
pictureComment: Some _Comment_ (supports _basic_ [Markdown](link))
author: author_filename
tags:
  - Open Source
  - Machine Learning
  - Data Science
  - Version Control
  - AI
---

```

- `title` (**required**) - title of the post.
- `date` (**required**) - publication date in the `YYYY-MM-DD` format. Will be
  used to sort posts and in RSS.
- `description` (**required**) - short description to show in the feed.
- `descriptionLong` (optional) - long description to show before the image on
  the post page. If not set, `description` will be used instead. Supports basic
  Markdown markup.
- `picture` (optional) - cover image, relative to `static/uploads/images`
- `pictureComment` (optional) - cover image comment. Supports basic Markdown
  markup.
- `author` (**required**) - base name of the file in `content/authors`
  representing this post's author. See
  [Adding authors](/doc/user-guide/contributing/blog#adding-authors) to add a
  new author.
- `commentsUrl` (optional) - link to the [DVC forum](https://discuss.dvc.org)
  topic. It will contain comments for the post.
- `tags` (optional) - list of tags.

## Content guidelines

It's recommended to follow all the relevant recommendations from the
[Doc style guidelines](/doc/user-guide/contributing/docs#doc-style-guidelines-javascript-and-markdown).

### Adding images

> 🙏 Please, be reasonable about the size of the image files you are about to
> commit — run an online image optimizer. Huge images pollute the Git index,
> slow down `git clone`, deployment, and other operations in the repository.

The original image should be 2x the height and width of the size you want to see
on the screen, to look sharp. To add images, put them into `static/uploads` and
reference them like this:

```md
![](/uploads/images/2020-02-10/image.png)
```

To add a subtitle:

```md
![](/uploads/images/2020-02-10/image.png) _subtitle [with a link](link)_
```

To set the image size and text wrap:

```md
![](/uploads/images/2020-02-10/image.png '=500')
![](/uploads/images/2020-02-10/image.png '=500 Some Title')
![](/uploads/images/2020-02-10/image.png 'Some Title =500')
![](/uploads/images/2020-02-10/image.png 'Some Title :wrap-left =500')
![](/uploads/images/2020-02-10/image.png ':wrap-left =500 Some Title')
```

### Embedding links

Any URLs
[supported by `gatsby-remark-embedder`](https://github.com/MichaelDeBoey/gatsby-remark-embedder#supported-services)
such as Youtube and Twitter share links will be embedded automatically. You just
need to paste them in the post Markdown, for example:

```md
... Check out this great video right here:

https://youtu.be/4h6I9_xeYA4

And now lets move onto ...
```

You can ember a preview of any other website using `<external-link>` tag:

```md
... Check out this great project:

<external-link
href="https://dvc.org/doc"
title="Open-source tools to version control Machine Learning models and experiments"
description="AI and ML are becoming an essential part of the engineering..."
link="dvc.org"
image="/uploads/images/image.png" />

And now lets move onto ...
```

## Adding authors

Create `.md` file in the `content/authors` folder.

Write front matter in the following format:

```yaml
name: John Doe
avatar: avatar.jpeg
link: https://www.twitter.com/johndoe
```

- `name` (**required**) – author's name.
- `avatar` (**required**) - path to the author's avatar, relative to
  `static/uploads/avatars` (1024x1024 is recommended).
- `link` (optional) - location that the author's name will link to.
