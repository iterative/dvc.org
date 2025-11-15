# Shell Tab Completion

Enjoy working with DVC faster and with fewer typos!

Shell completion is automatically enabled when DVC is installed on macOS
[with Homebrew](/install/macos#install-with-brew), or on Linux
[from **deb** or **rpm** repositories](/install/linux#install-from-repository)
or via [**snap**](/install/linux#install-with-snap).

See below for other DVC installation methods.

## How it works

Command completion is usually triggered by pressing the `<tab>` key in your
shell. Your shell will then list the possible arguments. For example:

```cli
$ dvc r<tab>
Completing dvc commands
remote  -- Set up and manage data remotes.
remove  -- Remove stages or .dvc files, unprotect their outputs, ...
repro   -- Reproduce complete or partial pipelines by executing ...
root    -- Return the relative path to the root of the DVC project.
run     -- Generate a stage file from a command and execute the command
```

Depending on what you typed on the command line so far, it completes:

- Available DVC commands & subcommands. For example, `dvc plots <tab>` suggests
  `diff`, `modify`, `show`, and `templates`.
- Valid options (`--flags`). For example, `dvc add --r<tab>` suggests
  `--recursive` and `--remote`.
- Argument that make sense in a given context. For example, `dvc repro <tab>`
  suggests existing <abbr>DVC files</abbr>.

## What shell do you have?

Use the command `echo $0` to check which shell you are using (`bash`, `zsh`, or
`tcsh`), then follow the instruction below to install and configure shell
completion.

<toggle>
<tab title="Bash">
<toggle>
<tab title="macOS">

1. First, make sure that Bash completion support is installed:

   ```cli
   $ brew install bash-completion
   ```

   then edit `~/.bash_profile` and make sure that these lines appear:

   ```bash
   if [ -f "$(brew --prefix)"/etc/bash_completion ]; then
       . "$(brew --prefix)"/etc/bash_completion
   fi
   ```

2. Run this command to install DVC completions:

   ```cli
   $ dvc completion -s bash \
     | sudo tee "$(brew --prefix)"/etc/bash_completion.d/dvc
   ```

3. Finally, open a new terminal to activate completions.

</tab>
<tab title="Debian/Ubuntu">

1. First, make sure that Bash completion support is installed:

   ```cli
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

2. Run this command to install DVC completions:

   ```cli
   $ dvc completion -s bash | sudo tee /etc/bash_completion.d/dvc
   ```

3. Finally, open a new terminal to activate completions.

</tab>
</toggle>
</tab>
<tab title="Zsh">

Place the completion script in a directory included in `$fpath`. Zsh expects the
file name to be `_dvc`.

1. First, check if Zsh completion support is installed. Make sure that these
   lines appear in `~/.zshrc` to load `compinit`:

   ```bash
   # Use modern completion system
   autoload -Uz compinit
   compinit
   ```

2. Run this command to install DVC completions:

   ```cli
   $ dvc completion -s zsh | sudo tee /usr/local/share/zsh/site-functions/_dvc
   ```

3. Finally, open a new terminal to activate completions.

4. Optionally, make completion output look much nicer by adding color hints. Add
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

</tab>
<tab title="tcsh">

1. Run this command to install DVC completions:

   ```dvc
   $ dvc completion -s tcsh | sudo tee /etc/profile.d/dvc.completion.csh
   ```

2. Open a new terminal to activate completions.

</tab>
</toggle>
