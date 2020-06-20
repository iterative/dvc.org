# Shell Tab Completion

Enjoy working with DVC faster and with fewer typos!

Shell completion is automatically enabled when DVC is installed on MacOS
[with Homebrew](/doc/install/macos#install-with-brew), or on Linux
[from **deb** or **rpm** repositories](/doc/install/linux#install-from-repository)
or via [**snap**](/doc/install/linux#install-with-snap).

Please follow the instructions below for other DVC installation methods.

## How it works

Command completion is usually requested by pressing the `tab` key on your shell,
it will then present the possible arguments that can follow that command name.
For example:

```dvc
$ dvc r # Press [tab] key
Completing dvc commands
remote  -- Set up and manage data remotes.
remove  -- Remove stage entry and unprotect outputs
repro   -- Reproduce complete or partial pipelines by executing their stages.
root    -- Return the relative path to the root of the DVC project.
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

   then edit `~/.bash_profile` and make sure that these lines appear:

   ```bash
   if [ -f $(brew --prefix)/etc/bash_completion ]; then
       . $(brew --prefix)/etc/bash_completion
   fi
   ```

2. Run these commands to install DVC completions:

   ```dvc
   $ DVC_BIN="$(which dvc)"
   $ echo 'which "'$DVC_BIN'" && eval "$("'$DVC_BIN'" completion -s bash)"' \
       >> ~/.bash_completion
   ```

3. Finally, `source ~/.bash_profile` or open a new terminal to activate
   completions.

## Bash completion on Debian/Ubuntu

1. First, make sure that Bash completion support is installed:

   ```dvc
   $ sudo apt install --reinstall bash-completion
   ```

   then edit `~/.bashrc` and make sure that these lines appear:

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

2. Run these commands to install DVC completions:

   ```dvc
   $ DVC_BIN="$(which dvc)"
   $ echo 'which "'$DVC_BIN'" && eval "$("'$DVC_BIN'" completion -s bash)"' \
       >> ~/.bash_completion
   ```

3. Finally, `source ~/.bashrc` or open a new terminal to activate completions.

## Zsh completion

Place the completion script in a directory included in `$fpath`. Zsh expects the
file name to be `_dvc`.

A nice way to ensure completions are always up-to-date is to refresh them
whenever a new terminal is opened.

1. First, check if Zsh completion support is installed. Make sure that these
   lines appear in `~/.zshrc` to load `compinit`:

   ```bash
   # Use modern completion system
   autoload -Uz compinit
   compinit
   ```

2. Find out where DVC is installed by running `which dvc`

3. Edit `~/.zshrc` and add the following lines to the top of the file, replacing
   `PATH_TO_DVC` with the output of `which dvc`:

   ```bash
   mkdir -p ~/.local/completions
   fpath=($fpath ~/.local/completions)
   which "PATH_TO_DVC" && "PATH_TO_DVC" completion -s zsh \
     > ~/.local/completions/_dvc
   ```

4. Finally, `exec $SHELL -l` or open a new terminal to activate completions.

5. Optionally, make completion output look much nicer by adding color hints. Add
   the following to `~/.zshrc`:

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
