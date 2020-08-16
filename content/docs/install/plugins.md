# IDE Plugins and Syntax Highlighting

When you add a file or a stage to your pipeline, DVC creates a special `.dvc` or
`dvc.yaml` file (respectively) that contains all the needed information to track
your data and transformations.

The file itself is in a simple YAML format.

We also provide a [schema](https://github.com/iterative/dvcyaml-schema) for
`dvc.yaml` that enables automatic syntax checks and auto-completion.

## Visual Studio Code

To make `.dvc` files and `dvc.lock` files as YAML, you should add following in
the settings:

```json
"files.associations": {
    "*.dvc": "yaml",
    "dvc.lock": "yaml"
}
```

To get auto-completion and syntax checks, you can install
[YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
that provides auto-completion and syntax checks for `dvc.yaml` files.

## Pycharm/Intellij

Pycharm/Intellij should ask how to associate file types for `.dvc` and
`dvc.lock` files when you first open them. If not, follow
[Pycharm's guide](https://www.jetbrains.com/help/pycharm/creating-and-registering-file-types.html)
to set them manually.

Pycharm, by default, provides auto-completion and syntax checks for `dvc.yaml`
files. If not, refer to the
[usage instructions for installing schema](https://github.com/iterative/dvcyaml-schema).

## Vim

In order to recognize `.dvc` and `dvc.lock` files as YAML in Vim, you should
add:

```vim
" DVC
autocmd! BufNewFile,BufRead Dvcfile,*.dvc,dvc.lock setfiletype yaml
```

to your `~/.vimrc`(to be created if it doesn't exist).
