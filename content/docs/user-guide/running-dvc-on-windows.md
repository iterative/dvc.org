# Running DVC on Windows

Different issues can arise when running DVC on Microsoft Windows, mainly
involving system performance. Some, for example, have to do with NTFS file
system characteristics and Windows built-in security mechanisms. Below are some
workarounds that can help avoid these potential problems:

## POSIX-like command line experience

The regular Command Prompt (`cmd`) in Windows will most likely not help you use
DVC effectively, or follow the examples in our docs. Please avoid it. There's no
perfect solution, but here are some ideas:

- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) with
  [Windows Terminal](https://devblogs.microsoft.com/commandline/) supports the
  most CLI features (e.g. `\` line continuation). It has
  [good performance](https://itigic.com/wsl-vs-wsl2-performance-in-windows-10-update/)
  (and can even
  [access GPUs](https://channel9.msdn.com/Shows/Tabs-vs-Spaces/GPU-Accelerated-Machine-Learning-with-WSL-2)).
- The full [Cmder](https://cmder.net/) console emulator is another good option.
  It combines several useful tools like [ConEmu](https://conemu.github.io/)
  terminal and [Git for Windows](https://gitforwindows.org/) (Git Bash), among
  [other shells](https://github.com/cmderdev/cmder/blob/master/README.md#features).
- [Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win)
  is also popular.
- Install an actual Linux distro (e.g. Ubuntu) on a
  [virtual machine](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/),
  or in an HD partition (dual boot).

## Enable symbolic links

Symlinks are one of the possible file link types that DVC can use for
[optimization](/doc/user-guide/large-dataset-optimization) purposes. They're
available on Windows, but the _Create symbolic links_ user privilege is needed.
It's granted to the _Administrators_ group by default, so running `dvc` in an
admin terminal is a good option for occasional usage. For regular users, it can
be granted using the Local policy settings.

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

`dvc pull` may fail in some cases when the folder path is longer than 260
characters. In the Windows API, the maximum allowed length for a path is 260
characters. If required, the user can explicitly enable long paths by following
[this](https://blogs.msdn.microsoft.com/jeremykuhne/2016/07/30/net-4-6-2-and-long-paths-on-windows-10/)
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
[Chocolatey](https://chocolatey.org/) (please install the tool first):

```dvc
$ choco install less
```

`less` can be installed in other ways, just make sure it's available in the
command line environment where you run `dvc`. (This usually means adding the
directory where `less` is installed to the `PATH` environment variable.)
