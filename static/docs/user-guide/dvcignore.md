# .dvcignore files

Sometimes you might want DVC to ignore files while traversing the project 
directory. For example, when working on project with many files in its data 
directory, you might encounter extended execution time for operations 
that are as simple as `dvc status`. To prevent this, we are implementing
`.dvcignore` files handling. When fully implemented, their implementation is 
intended to provide similar funcionality as `.gitignore` files provide for 
`git`.

## Syntax

The same as for [`.gitignore`](https://git-scm.com/docs/gitignore).

## Current limitations

During development, we noticed that there are few potential uses cases that 
might be tricky to handle (e.g. what to do when we are `dvc add`-ing 
directory containing `.dvcignore` file). Therefore, we decided to enable 
this feature gradually in different parts of the project. 

Currently .dvcignore files will be read and applied in any operation that 
collects stage files(e.g. `checkout`, `metrics`, `status`, `run`, 
`repro`), so it is advised to use it in case described in first paragraph, 
when amount of files in tree of repository directory causes performance issues.

