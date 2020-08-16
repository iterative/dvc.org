# IDE Plugins and Syntax Highlighting

When you add a file or a stage to your pipeline, DVC creates a special `.dvc` or
`dvc.yaml` file (respectively) that contains all the needed information to track
your data and transformations.

The file itself is in a simple YAML format.

We maintain a [schema](https://github.com/iterative/dvcyaml-schema) for
`dvc.yaml` that can enable IDE syntax checks and auto-completion.

## Visual Studio Code

To make `dvc.lock` and `.dvc` files recognized as YAML, add the following in
`settings.json`:

```json
"files.associations": {
    "*.dvc": "yaml",
    "dvc.lock": "yaml"
}
```

Enable enhanced
[IntelliSense](https://code.visualstudio.com/docs/editor/intellisense),
on `dvc.yaml` files by installing the
[YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

## PyCharm/IntelliJ

The IDE should ask how to associate file types for `dvc.lock` and `.dvc` files
when you first open one of them. If not, follow
[this guide](https://www.jetbrains.com/help/pycharm/creating-and-registering-file-types.html)
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
