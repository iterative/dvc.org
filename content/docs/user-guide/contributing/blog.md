# Writing Blog Posts

Create `.md` file in the `content/blog` folder. File name will be used as
`slug`ю

Write frontmatter in the following format:

```yml
---
title: Hello World
date: '2015-05-01T22:12:03.284Z'
description: 'Hello World'
descriptionLong: |
  Some long
  multiline
  text
picture: /uploads/image.jpeg
pictureComment: Some Comment
author: ../authors/author_name.md
tags:
  - Open Source
  - Machine Learning
  - Data Science
  - Version Control
  - AI
---

```

- `title` - **Required.** Title of the post.
- `date` - **Required.** Post date. Will be used to sort posts and in RSS.
- `description` - **Required.** Short description to show in the feed.
- `descriptionLong` - Optional long description to show before image on the post
  page. If not set, `description` will be used instead.
- `picture` - Optional cover image.
- `pictureComment` - Optional cover image comment.
- `author` - **Required** Relative path to `.md` file with information about the
  author.
- `tags` - Optional list of tags.

## Adding authors

Create `.md` file in the `content/authors` folder.

Write frontmatter in the following format:

```yml
path: ../authors/relative_path_to_file.md
name: Author's Name
avatar: /uploads/avatar.jpeg
```

- `path` - **Required** String that the CMS will insert to the author field in
  the blog post. Should be equal to the path from the blog post to the author's
  `.md` file.
- `name` – **Required** Author's name.
- `avatar` - **Required** relative path to the author's avatar.
