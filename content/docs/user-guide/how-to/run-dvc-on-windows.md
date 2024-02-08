---
title: 'How to Run DVC on Windows'
description: >-
  Learn to setup your Windows environment for an optimal experience using DVC.
---

# How to Run DVC on Windows

Different issues can arise when running DVC on Microsoft Windows, mainly
involving system performance. Some, for example, have to do with NTFS file
system characteristics and Windows built-in security mechanisms. Below are some
workarounds that can help avoid these potential problems:

<admon type="info">

Did you know that DVC is available for Microsoft **Visual Studio Code**? More
details [here](/doc/install/ide-plugins#visual-studio-code)!

</admon>

## POSIX-like command line experience

The regular Command Prompt (`cmd`) in Windows will most likely not help you use
DVC effectively, nor help you follow the examples in our docs. Here are some
alternatives:

- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) with
  [Windows Terminal](https://devblogs.microsoft.com/commandline/) supports the
  most CLI features (e.g. `\` line continuation). It has
  [good performance](https://itigic.com/wsl-vs-wsl2-performance-in-windows-10-update/)
  (and can even
  [access GPUs](https://channel9.msdn.com/Shows/Tabs-vs-Spaces/GPU-Accelerated-Machine-Learning-with-WSL-2)).
- The full [Cmder](https://cmder.app/) console emulator is another good option.
  It combines several useful tools like [ConEmu](https://conemu.github.io/)
  terminal and [Git for Windows](https://gitforwindows.org/) (Git Bash), among
  [other shells](https://github.com/cmderdev/cmder/blob/master/README.md#features).
- [Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win)
  is also popular.
- Install an actual Linux distro (e.g. Ubuntu) on a
  [virtual machine](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/),
  or in an HD partition (dual boot).

## Line endings

If you are using Windows and you are working with people or environments (e.g.
production) that are not, you’ll probably run into line-ending issues at some
point. This is because Windows uses both a carriage-return character and a
linefeed character for newlines in its files (CRLF), whereas macOS and Linux
systems use only the linefeed character (LF).

Since DVC is using content-based checksums for your pipeline dependencies,
depending on your Git configuration (see
[core.autocrlf and core.eol config options](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)),
DVC might see Git-tracked files as changed, thus triggering pipeline
reproduction on `dvc repro` on one system and not on another. Thus we strongly
recommend sticking with LF line endings when doing cross-platform work.

### Configure your editor to use LF line endings

Many editors on Windows will use CRLF line endings by default or even replace
existing LF with CRLF. It is recommended that you configure your editor to
always stick to LF line endings.

For VS Code, add

```
{

    "files.eol": "\n",

}
```

to your global `settings.json` or to your project's `.vscode/settings.json`.

### Use pre-commit hook to check and fix line endings

Add this to your `.pre-commit-config.yaml` hooks:

```
      - id: mixed-line-ending
        args: [--fix=lf]
```

to make `pre-commit` check and automatically replace all line endings with LF.

## Enable symbolic links

Symlinks are one of the possible file link types that DVC can use for
[optimization](/doc/user-guide/data-management/large-dataset-optimization)
purposes. They're available on Windows, but the _Create symbolic links_ user
privilege is needed. It's granted to the _Administrators_ group by default, so
running `dvc` in an admin terminal is a good option for occasional usage. For
regular users, it can be granted using the Local policy settings.

This is done automatically by DVC's [Windows installer](/doc/install/windows),
but you may want to
[do it manually](https://docs.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/create-symbolic-links)
after any other installation method (`choco`, `conda`, `pip`).

## Whitelist in Windows Security

Windows 10 includes the
[Windows Security](https://support.microsoft.com/en-us/help/4013263/windows-10-stay-protected-with-windows-security)
antivirus. If user wants to avoid antivirus scans on specific folders or files
to improve the performance, then whitelist them in Windows Security as per
[this](https://support.microsoft.com/en-in/help/4028485/windows-10-add-an-exclusion-to-windows-security)
guide. For example, we can whitelist DVC binary files on Windows to speed up the
processes.

## Enable long folder/file paths

DVC commands (e.g. `dvc pull`, `dvc repro`) may fail when the folder path is
longer than 260 characters. This may happen with the error
`[Errno 2] No such file or directory`. Starting in Windows 10, path length
limitations have been removed from common file and directory functions. However,
you must opt-in to the new behavior. The user can explicitly enable long paths
either by editing Group Policy or by editing registry keys following
[this](https://www.howtogeek.com/266621/how-to-make-windows-10-accept-file-paths-over-260-characters/)
guide.

## Fix or disable Search Indexing

Search Indexing can also slow down file I/O operations on Windows. Try
[fixing](https://www.groovypost.com/howto/fix-windows-10-search-index/) or
[disabling](https://winaero.com/blog/disable-search-indexing-windows-10/) this
feature if you don't need it.

## Disable short-file name generation

With NTFS, users may want to disable `8dot3` as per
[this article](https://support.microsoft.com/en-us/help/121007/how-to-disable-8-3-file-name-creation-on-ntfs-partitions)
to disable the short-file name generation. It is important to do so for better
performance when the user has over 300K files in a single directory.

## Avoid directories with large number of files

The performance of NTFS degrades while handling large volumes of files in a
directory, as explained in
[this issue](https://stackoverflow.com/questions/197162/ntfs-performance-and-large-volumes-of-files-and-directories).

## Enabling paging with `less`

By default, DVC tries to use [Less](<https://en.wikipedia.org/wiki/Less_(Unix)>)
as pager for the output of `dvc dag`. Windows doesn't have the `less` command
available however. Fortunately, there is a easy way of installing it via
[Chocolatey](https://chocolatey.org). After installing Chocolatey, run:

```cli
$ choco install less
```

`less` can be installed in other ways, just make sure it's available in the
command line environment where you run `dvc`. (This usually means adding the
directory where `less` is installed to the `PATH` environment variable.)
