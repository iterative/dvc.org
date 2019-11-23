# Using Docker

Currently we don't provide any official Docker image, however you can easily
create it yourself.

## Writing the Dockerfile

We support several ways to install DVC, the two recommended ones are through
`pip` and `conda`.

You can base your image on the official Python one:

```dockerfile
FROM python

# Remember to include the cloud providers that you plan to use,
# for example: "dvc[s3]"
RUN pip install dvc
```

Or use a Conda based image:

```dockerfile
FROM continuumio/miniconda3

RUN conda install dvc -y --quiet
```

For a recommended reading about writing Dockerfiles for Python applications, you
can take a look at https://pythonspeed.com/docker/

## Using Docker for your development environment

Since `dvc` is a command line application, we have several recommendations to
enhance the experience:

- Make sure your _locale_ is set to UTF-8
- Install the Zsh shell and its respective autocompletion script.
- Install `less` so you can pipe the output of `dvc pipeline show`.
- Enable movements with `Ctrl + Arrow` by editing the _inputrc_ file.
- Use `pip install dvc` at the end of the file for better caching.
- Set your `WORKDIR` to the path where you are going to mount your project.

If you are using Linux, remember to map your user to your container. This way,
you make sure your files are still writable. For more information:
https://docs.docker.com/engine/security/userns-remap/

### Example Dockerfile

The following is a **suggestion** for a Dockerfile to use during development:

```dockerfile
FROM python

# Use UTF-8 as the default locale
ENV LANG=C.UTF-8

# Better movement with [Ctrl + →] and [Ctrl + ←]
ENV INPUTRC=/etc/inputrc

RUN set -ex \
  && echo '"\e[1;5C": forward-word' >> /etc/inputrc \
  && echo '"\e[1;5D": backward-word' >> /etc/inputrc

# Set working directory.
# Mount your project under the same path.
WORKDIR /usr/src

# Install useful programs
RUN apt-get update -y && apt-get install -y \
      zsh \
      less \
      git

#  Set Zsh as the default shell
SHELL ["/usr/bin/zsh", "-c"]

# Enable autocompletion scripts for DVC
# and rice the completion style with `zstyle`:
# http://zsh.sourceforge.net/Doc/Release/Zsh-Modules.html#The-zsh_002fzutil-Module
RUN wget \
      -O /usr/local/share/zsh/site-functions/_dvc \
      https://raw.githubusercontent.com/iterative/dvc/master/scripts/completion/dvc.zsh \
      && echo "autoload -U compinit && compinit" >> /root/.zshrc \
      && echo "zstyle ':completion:*:*:*:*:*' menu select" >> /root/.zshrc \
      && echo "zstyle ':completion:*:matches' group 'yes'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:options' description 'yes'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:options' auto-description '%d'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:corrections' format ' %F{green}-- %d (errors: %e) --%f'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:descriptions' format ' %F{yellow}-- %d --%f'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:messages' format ' %F{purple} -- %d --%f'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:warnings' format ' %F{red}-- no matches found --%f'" >> /root/.zshrc \
      && echo "zstyle ':completion:*:default' list-prompt '%S%M matches%s'" >> /root/.zshrc \
      && echo "zstyle ':completion:*' format ' %F{yellow}-- %d --%f'" >> /root/.zshrc \
      && echo "zstyle ':completion:*' group-name ''" >> /root/.zshrc \
      && echo "zstyle ':completion:*' verbose yes" >> /root/.zshrc

# Install DVC supporting all the remotes
RUN pip install "dvc[all]"

# vim: ft=dockerfile
```

Then, build the image and run it:

```console
$ TAG="dvc:development"
$ docker build -t $TAG .
$ docker run --interactive \
             --tty \
             --rm \
             --volume $PWD:/usr/src \
             $TAG
```
