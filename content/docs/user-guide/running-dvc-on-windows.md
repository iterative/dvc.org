# Running DVC on Windows

Different issues can arise when running DVC on Microsoft Windows, mainly
involving system performance. Some, for example, have to do with NTFS file
system characteristics and Windows built-in security mechanisms. Below are some
workarounds that can help avoid these potential problems:

## POSIX-like command line shell

Many of the DVC commands have POSIX-style options that are given with a double
dash `--`. This isn't supported by the simple Windows command prompt `cmd`.

Common Windows terminal alternatives are
[Git Bash](https://gitforwindows.org/#bash) or
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win)
– but they may not support all the POSIX features (e.g. `\` line continuation).

💡 We recommend the full [Cmder](https://cmder.net/) console emulator (which
already includes _Git for Windows_).

Its also possible to enjoy a full Linux terminal experience with the
[WSL](https://blogs.windows.com/windowsdeveloper/2016/03/30/run-bash-on-ubuntu-on-windows/)
– but it may not be possible to access GPUs from this subsystem.

## Disable short-file name generation

With NTFS, users may want to disable `8dot3` as per
[this article](https://support.microsoft.com/en-us/help/121007/how-to-disable-8-3-file-name-creation-on-ntfs-partitions)
to disable the short-file name generation. It is important to do so for better
performance when the user has over 300K files in a single directory.

## Whitelist in Windows Security

Windows 10 includes the
[Windows Security](https://support.microsoft.com/en-us/help/4013263/windows-10-stay-protected-with-windows-security)
antivirus features. If user wants to avoid antivirus scans on specific folders
or files to improve the performance, then whitelist them in Windows Security as
per
[this](https://support.microsoft.com/en-in/help/4028485/windows-10-add-an-exclusion-to-windows-security)
guide. For example, we can whitelist DVC binary files on Windows to speed up the
processes.

## Enable long folder/file paths

`dvc pull` may fail in some cases when the folder path is longer than 260
characters. In the Windows API, the maximum allowed length for a path is 260
characters. If required, the user can explicitly enable long paths by following
[this](https://blogs.msdn.microsoft.com/jeremykuhne/2016/07/30/net-4-6-2-and-long-paths-on-windows-10/)
guide.

## Avoid directories with large number of files

The performance of NTFS degrades while handling large volumes of files in a
directory, as explained in
[this issue](https://stackoverflow.com/questions/197162/ntfs-performance-and-large-volumes-of-files-and-directories).

## Enabling paging with `less`

By default, DVC tries to use [Less](<https://en.wikipedia.org/wiki/Less_(Unix)>)
as pager for the output of `dvc pipeline show`. Windows doesn't have the less
command available however. Fortunately, there is a easy way of installing `less`
via [Chocolatey](https://chocolatey.org/) (please install the tool first):

```dvc
$ choco install less
```

`less` can be installed in other ways, just make sure it's available in
`cmd`/PowerShell, where you run `dvc`. (This usually means adding the directory
where `less` is installed to the `PATH` environment variable.)
