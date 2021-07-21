### Organization Patterns

DVC takes care of arranging `dvc exp` experiments and the data
<abbr>cache</abbr> under the hood. But when it comes to full-blown persistent
experiments, it's up to you to decide how to organize them in your project.
These are the main alternatives:

- **Git tags and branches** - use the repo's "time dimension" to distribute your
  experiments. This makes the most sense for experiments that build on each
  other. Helpful if the Git [revisions](https://git-scm.com/docs/revisions) can
  be easily visualized, for example with tools
  [like GitHub](https://docs.github.com/en/github/visualizing-repository-data-with-graphs/viewing-a-repositorys-network).
- **Directories** - the project's "space dimension" can be structured with
  directories (folders) to organize experiments. Useful when you want to see all
  your experiments at the same time (without switching versions) by just
  exploring the file system.
- **Hybrid** - combining an intuitive directory structure with a good repo
  branching strategy tends to be the best option for complex projects.
  Completely independent experiments live in separate directories, while their
  progress can be found in different branches.
