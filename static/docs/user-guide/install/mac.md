# Installation on MacOS

## Install DVC

```dvc
$ brew install iterative/homebrew-dvc/dvc
```

or:

```dvc
$ brew cask install iterative/homebrew-dvc/dvc
```

## Install bash-completion

1. First, make sure that Bash completion support is installed:

   ```dvc
   $ brew install bash-completion
   ```

2. Then download the
   [DVC completion script](https://github.com/iterative/dvc/blob/master/scripts/completion/dvc.bash)
   and save it on `/usr/local/etc/bash_completion.d/`:

   ```bash
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
