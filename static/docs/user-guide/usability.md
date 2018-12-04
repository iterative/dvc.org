# Usability

You can enrich your DVC experience with the following:

## Shell command completion

Command completion is usually requested by pressing the `tab` key on your
shell, it will then present the possible options that could follow that command
call. For example:

```bash
dvc r # Press [tab] key

#  -- dvc commands --
# remote  -- Manage set of tracked repositories.
# remove  -- Remove outputs of DVC file.
# repro   -- Reproduce DVC file. Default file name - 'Dvcfile'.
# root    -- Relative path to project's directory.
# run     -- Generate a stage file from a given command and execute the command
```

Depending on what you typed on the command line so far, it completes:

- Available DVC commands
- Options that are available for a particular command
- File names that make sense in a given context, such as using them as a target for some commands.
- Arguments for selected options. For example, dvc repro completes with stage files to reproduce.

Enjoy working with DVC faster and with fewer typos!

### Bash

Make sure Bash completion is installed.

- On a current Linux OS (in a non-minimal installation), bash completion should
  be available.

-  On a Mac, install with `brew install bash-completion`.

The script is located in this path of our main repository:
[dvc/scripts/completion/dvc.bash](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.bash)

Place the completion script in `/etc/bash_completion.d/` (or
`/usr/local/etc/bash_completion.d/` on a Mac):

For example:

```bash
sudo wget \
  -O /etc/bash_completion.d/dvc \
  https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.bash
```

On a Mac, add the following to your `~/.bash_profile`:

```bash
if [ -f $(brew --prefix)/etc/bash_completion ]; then
    . $(brew --prefix)/etc/bash_completion
fi
```

You can source your `~/.bash_profile` or launch a new terminal to utilize
completion.

### Zsh

The script is located in this path of our main repository:
[dvc/scripts/completion/dvc.zsh](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.zsh)

Place the completion script in a directory included in `$fpath`,
the file should be named `_dvc`.

For example:

```bash
sudo wget \
  -O /usr/share/zsh/site-functions/_dvc \
  https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.zsh
```

Make sure `compinit` is loaded or do it by adding in `~/.zshrc`:

```bash
autoload -Uz compinit && compinit -i
```

Then reload your shell:

```bash
exec $SHELL -l
```

_NOTE: It would also look great if you add the following to your `~/.zshrc`:_

```bash
# Case insensitive match
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*' 'l:|=* r:|=*'

# Group matches and describe.
zstyle ':completion:*:*:*:*:*' menu select
zstyle ':completion:*:matches' group 'yes'
zstyle ':completion:*:options' description 'yes'
zstyle ':completion:*:options' auto-description '%d'
zstyle ':completion:*:corrections' format ' %F{green}-- %d (errors: %e) --%f'
zstyle ':completion:*:descriptions' format ' %F{yellow}-- %d --%f'
zstyle ':completion:*:messages' format ' %F{purple} -- %d --%f'
zstyle ':completion:*:warnings' format ' %F{red}-- no matches found --%f'
zstyle ':completion:*:default' list-prompt '%S%M matches%s'
zstyle ':completion:*' format ' %F{yellow}-- %d --%f'
zstyle ':completion:*' group-name ''
zstyle ':completion:*' verbose yes
```

## Syntax Highlighting

When you add a file or a stage to your pipeline, DVC creates a special
[.dvc file](https://dvc.org/doc/user-guide/dvc-file-format) that contains all
the needed information to track your data.

The file itself is in a simple YAML format.

### Vim

In order to recognize DVC stage files as YAML in Vim, you should add:

```vim
  " DVC
  autocmd! BufNewFile,BufRead Dvcfile,*.dvc setfiletype yaml
```

### IntelliJ IDEs

A community member, [@prihoda](https://github.com/prihoda), maintains a
plugin for IntelliJ IDEs, it offers a more robust integration than just
syntax highlighting.

You can download the plugin from
[JetBrains Plugins repository](https://plugins.jetbrains.com/plugin/11368-dvc-support-poc)

For more information, visit the plugin's repository:
[prihoda/intellij-dvc-support-poc](https://github.com/prihoda/intellij-dvc-support-poc/)
