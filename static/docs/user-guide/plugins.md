# IDE Plugins & Syntax Highlighting

When you add a file or a stage to your pipeline, DVC creates a special
[.dvc file](https://dvc.org/doc/user-guide/dvc-file-format) that contains all
the needed information to track your data and transformations.

The file itself is in a simple YAML format.

## Vim

In order to recognize DVC stage files as YAML in Vim, you should add:

```vim
" DVC
autocmd! BufNewFile,BufRead Dvcfile,*.dvc setfiletype yaml
```

to your `~/.vimrc`(to be created if it doesn't exist).

## IntelliJ IDEs

A community member, [@prihoda](https://github.com/prihoda), maintains a plugin
for IntelliJ IDEs, it offers a more robust integration than just syntax
highlighting.

You can download the plugin from
[JetBrains Plugins repository](https://plugins.jetbrains.com/plugin/11368-dvc-support-poc)

For more information, visit the plugin's repository:
[iterative/intellij-dvc/](https://github.com/iterative/intellij-dvc/)
