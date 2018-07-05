# Installation


Operating system dependent packages are the recommended way to install DVC.
Some other methods of installation are also available.

## OS Packages

DVC installation packages are available for Mac OS, Linux, and Windows.
You can download the packages
[here](https://github.com/iterative/dvc/releases/).

## Python pip

Another option is to use the standard Python pip package:

```sh
    $ pip install dvc
```

**Note:** It works in *Anaconda’s* command prompt tool. At the moment, DVC does
not provide a special installation package for the native *Anaconda* package
manager *conda*.

## Homebrew

Mac OS users can also install DVC by using either **brew formula** or
**brew cask**.

### Formula

```sh
    $ brew install iterative/homebrew-dvc/dvc
```

### Cask

```sh
    $ brew cask install iterative/homebrew-dvc/dvc
```

## Development Version

If you would like to pull the latest version of DVC, you can do the following:

```sh
    $ pip install git+git://github.com/iterative/dvc
```

**Note**: this will automatically upgrade your DVC version to the latest
development version.
