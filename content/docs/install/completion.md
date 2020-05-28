# Shell Tab Completion

Enjoy working with DVC faster and with fewer typos!

Shell completion is automatically enabled when DVC is installed on MacOS
[with Homebrew](/doc/install/macos#install-with-brew), or on Linux
[from **deb** or **rpm** repositories](/doc/install/linux#install-from-repository)
or via [**snap**](/doc/install/linux#install-with-snap). Please follow the
instructions below for other DVC installation methods.

## How it works

Command completion is usually requested by pressing the `tab` key on your shell,
it will then present the possible arguments that can follow that command name.
For example:

```dvc
$ dvc r # Press [tab] key
 -- dvc commands --
remote  -- Manage remote storage configuration.
remove  -- Remove outputs of `.dvc` file.
repro   -- Check for changes and reproduce `.dvc` file and dependencies.
root    -- Relative path to project's directory.
run     -- Generate a stage file from a command and execute the command.
```

Depending on what you typed on the command line so far, it completes:

- Available DVC commands.
- Options (flags) that are available for a particular command.
- File names that make sense in a given context, such as using them as a target
  for some commands.
- Values for certain command arguments. For example, `dvc repro` completes with
  stage files to reproduce.

## What shell do you have?

Use the command `echo $0` to check your active shell, if you are not sure which
one you are using (Bash or Zsh).

Depending on the shell that you are using, follow the instruction below to
install and configure shell completion.

## Bash completion on MacOS

1. First, make sure that Bash completion support is installed:

   ```dvc
   $ brew install bash-completion
   ```

2. Then download the
   [DVC completion script](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.bash)
   and save it on `/usr/local/etc/bash_completion.d/`:

   ```dvc
   $ sudo wget \
       -O /usr/local/etc/bash_completion.d/dvc \
       https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.bash
   ```

3. Edit `~/.bash_profile` and make sure that these lines are there:

   ```bash
   if [ -f $(brew --prefix)/etc/bash_completion ]; then
       . $(brew --prefix)/etc/bash_completion
   fi
   ```

4. Finally, `source ~/.bash_profile` or launch a new terminal to activate it.

## Bash completion on Debian/Ubuntu

1. First, make sure that Bash completion support is installed:

   ```dvc
   $ sudo apt install --reinstall bash-completion
   ```

2. Then download the
   [DVC completion script](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.bash)
   and save it on `/etc/bash_completion.d/`:

   ```dvc
   $ sudo wget \
       -O /etc/bash_completion.d/dvc \
       https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.bash
   ```

3. Edit `~/.bashrc` and make sure that these lines are there:

   ```bash
   # enable bash completion in interactive shells
   if ! shopt -oq posix; then
     if [ -f /usr/share/bash-completion/bash_completion ]; then
       . /usr/share/bash-completion/bash_completion
     elif [ -f /etc/bash_completion ]; then
       . /etc/bash_completion
     fi
   fi
   ```

4. Finally, `source ~/.bashrc` or open a new terminal to activate it.

## Zsh completion

The DVC specific completion script is located in this path of our main
repository:
[dvc/scripts/completion/dvc.zsh](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.zsh)

Place the completion script in a directory included in `$fpath`, the file name
should be `_dvc`.

For example:

```dvc
$ sudo wget \
    -O /usr/local/share/zsh/site-functions/_dvc \
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

This step is optional but will make the DVC output look much nicer, by adding
more colors to it. Add the following to your `~/.zshrc`:

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
