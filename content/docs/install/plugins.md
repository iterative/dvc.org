# IDE Plugins and Syntax Highlighting

When you add a file or a stage to your pipeline, DVC creates a special `.dvc` or
`dvc.yaml` file (respectively) that contains all the needed information to track
your data and transformations.

The file itself is in a simple YAML format.

## Vim

In order to recognize `.dvc` files as YAML in Vim, you should add:

```vim
" DVC
autocmd! BufNewFile,BufRead Dvcfile,*.dvc setfiletype yaml
```

to your `~/.vimrc`(to be created if it doesn't exist).
