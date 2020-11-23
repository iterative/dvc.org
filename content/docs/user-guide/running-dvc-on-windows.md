# Running DVC on Windows

Different issues can arise when running DVC on Microsoft Windows, mainly
involving system performance. Some, for example, have to do with NTFS file
system characteristics and Windows built-in security mechanisms. Below are some
workarounds that can help avoid these potential problems:

## POSIX-like command line experience

The regular Command Prompt (`cmd`) in Windows will most likely not help you use
DVC effectively, or follow the examples in our docs. Please avoid it. There's no
perfect solution, but here are some ideas:

- The full [Cmder](https://cmder.net/) console emulator combines several useful
  tools like [ConEmu](https://conemu.github.io/), and
  [Git for Windows](https://gitforwindows.org/) (Git Bash) among other
  [shell options](https://github.com/cmderdev/cmder/blob/master/README.md#access-to-multiple-shells-in-one-window-using-tabs).
- [Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win)
  is another recommendation.
- Consider enabling and using
  [WSL](https://blogs.windows.com/windowsdeveloper/2016/03/30/run-bash-on-ubuntu-on-windows/)
  ([Windows Terminal](https://devblogs.microsoft.com/commandline/) also
  recommended) which supports the most CLI features (e.g. `\` line
  continuation). But it has major
  [I/O performance issues](https://www.phoronix.com/scan.php?page=article&item=windows10-okt-wsl&num=2)
  and is [unable to access GPUs](https://github.com/Microsoft/WSL/issues/829),
  among other limitations.
- Install an actual Linux distro (e.g. Ubuntu) on a virtual machine, or in a HD
  partition (dual boot).

## Enable symbolic links

This is done automatically by the DVC's Windows
[installer](/doc/install/windows), but you may want to do it manually after any
other installation methods like (`choco`, `conda`, `pip`).

Symlinks are one of the possible file link types that DVC can use for
[optimization](/doc/user-guide/large-dataset-optimization) purposes. They are
available on Windows, but the
[Create symbolic links](<https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn221947(v=ws.11)>)
user privilege is needed. It's granted to the _Administrators_ group by default,
so running `dvc` in a terminal as an admin is a good option for occasional use.
For regular users, it can be granted using the _Local Security Policy_ console.

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
