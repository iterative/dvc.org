# DVC Shell Autocomplete

Enjoy working with DVC faster and with fewer typos!

Command completion is usually requested by pressing the `tab` key on your shell,
it will then present the possible options that could follow that command call.
For example:

```dvc
$ dvc r # Press [tab] key

#  -- dvc commands --
# remote  -- Manage set of tracked repositories.
# remove  -- Remove outputs of DVC file.
# repro   -- Reproduce DVC file. Default file name - 'Dvcfile'.
# root    -- Relative path to project's directory.
# run     -- Generate a stage file from a given command and execute
```

Depending on what you typed on the command line so far, it completes:

- Available DVC commands.

- Options that are available for a particular command.

- File names that make sense in a given context, such as using them as a target
  for some commands.

- Arguments for selected options. For example, `dvc repro` completes with stage
  files to reproduce.

Depending upon your preference and the availability of both Bash and Zsh on your
system, follow the steps given below to Configure Bash and/or Zsh.

If you are new to working with shell or uncertain about your active shell, use
`$0` to check your active shell.

For example:

```dvc
$ echo $0

  /bin/bash
```

In this case, follow the steps to configure Bash as it is your active shell.

## Configure Bash

First, make sure Bash completion support is installed:

- On a current Linux OS (in a non-minimal installation), bash completion should
  be available.

- On a Mac, install with `brew install bash-completion`.

The DVC specific completion script is located in this path of our main
repository:
[dvc/scripts/completion/dvc.bash](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.bash)

You will need to place this script script into `/etc/bash_completion.d/` (or
`/usr/local/etc/bash_completion.d/` on a Mac):

For example:

```dvc
$ sudo wget \
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

## Configure Zsh

The DVC specific completion script is located in this path of our main
repository:
[dvc/scripts/completion/dvc.zsh](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.zsh)

Place the completion script in a directory included in `$fpath`, the file should
be named `_dvc`.

For example:

```dvc
$ sudo wget \
    -O /usr/share/zsh/site-functions/_dvc \
    https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.zsh
```

Make sure `compinit` is loaded or do it by adding in `~/.zshrc`:

```dvc
$ autoload -Uz compinit && compinit -i
```

Then reload your shell:

```dvc
$ exec $SHELL -l
```

This step is optional but will make look much nicer by adding more colors to it.
Add the following to your `~/.zshrc`:

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
