# IDE Plugins and Syntax Highlighting

When files or directories are added to the project, or stages to a pipeline,
<abbr>DVC files</abbr> are created or updated. These use a simple YAML format.

In the case of `dvc.yaml`, we maintain a
[schema description](https://github.com/iterative/dvcyaml-schema) that can
enable IDE syntax checks and auto-completion.

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
[IntelliSense](https://code.visualstudio.com/docs/editor/intellisense), on
`dvc.yaml` files by installing the
[YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

## JetBrain IDEs (PyCharm, Intellij IDEA, etc.)

These IDEs should ask how to associate file types for `dvc.lock` and `.dvc`
files when you first open one of them. If not, follow
[this guide](https://www.jetbrains.com/help/pycharm/creating-and-registering-file-types.html)
to set them manually.

PyCharm should provide auto-completion and syntax checks for `dvc.yaml` files
out of the box. If not, refer to
[these instructions](https://github.com/iterative/dvcyaml-schema).

## Vim

In order to recognize `dvc.lock` and `.dvc` files as YAML in Vim, you should
add:

```vim
" DVC
autocmd! BufNewFile,BufRead Dvcfile,*.dvc,dvc.lock setfiletype yaml
```

to your `~/.vimrc`(to be created if it doesn't exist).

## Doom Emacs

In order to recognize `dvc.lock` and `.dvc` files as YAML in Doom Emacs, add

```emacs-lisp
(use-package! yaml-mode
  :config
  (add-to-list 'auto-mode-alist '("\\.dvc" . yaml-mode))
  (add-to-list 'auto-mode-alist '("dvc.lock" . yaml-mode))
  )
```

to your `~/.doom.d/config.el`.
