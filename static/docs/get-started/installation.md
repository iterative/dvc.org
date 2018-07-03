# Installation


Operating system dependent packages are the recommended way to install DVC.
Some other methods of installation are available.

## OS packages

DVC installation packages are available for Mac OS, Linux, and Windows.
You can download the packages
[here](https://github.com/dataversioncontrol/dvc/releases/).

## Python pip

Another option is to use the standard Python pip package:

```sh
    $ pip install dvc
```

**Note:** It works in *Anaconda’s* command prompt tool. At the moment, DVC does
not provide a special installation package for the native *Anaconda* package
manager *conda*.

## Homebrew Cask

Mac OS users can install DVC by using the **brew** command:

```sh
    $ brew cask install dataversioncontrol/homebrew-dvc/dvc
```

## Development Version

If you would like to pull the latest version of DVC, you can do the following:

```sh
    $ pip install git+git://github.com/dataversioncontrol/dvc
```

**Note**: this will automatically upgrade your DVC version to the latest
version.
