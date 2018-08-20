# Install

There are three ways to install DVC: `pip`, OS package, and Homebrew (depending
on your OS some of these ways may be not available for you).

The simplest way to install DVC is:

```dvc
    $ pip install dvc
```

If you have troubles installing it with `pip`, self-contained binary packages
are provided, use Download button to the left or get them
[here](https://github.com/iterative/dvc/releases/). We also provide `deb` and
`rpm` repositories:

<details><summary><strong>Expand to install from deb repository (Ubuntu, Debian)</strong></summary>
<p>
</br>
<pre>
    $ wget https://dvc.org/deb/dvc.list
    $ sudo cp dvc.list /etc/apt/sources.list.d/
    $ sudo apt-get update
    $ sudo apt-get install dvc
</pre>
</p>
</details>
</br>

<details><summary><strong>Expand to install from rpm repository (Fedora, Centos)</strong></summary>
<p>
</br>
<pre>
    $ wget https://dvc.org/rpm/dvc.repo
    $ sudo cp dvc.repo /etc/yum.repos.d/
    $ sudo dnf update
    $ sudo dnf install dvc
</pre>
</p>
</details>
</br>

See [Development](/doc/user-guide/development) if you want to install the most
recent development version.

### Homebrew

Mac OS users can also install DVC by using either **brew formula** or
**brew cask**:

```dvc
    $ brew install iterative/homebrew-dvc/dvc
```

or:

```dvc
    $ brew cask install iterative/homebrew-dvc/dvc
```

