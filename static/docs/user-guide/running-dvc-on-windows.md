# Running DVC on Windows

There can different issues while running DVC on Windows. Some, for example, have
to do with NTFS file system characteristics and Windows built-in security
mechanisms. Below are some workarounds that can help avoid these potential
problems:

## POSIX-like command line shell

Many of the DVC commands have POSIX-style options that are given with a double
dash `--`. This isn't supported by the simple Windows command prompt `cmd`.

We recommend [Git Bash](https://gitforwindows.org/#bash) or
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win).
Its even possible to enjoy a full Linux terminal experience with the
[WSL](https://blogs.windows.com/windowsdeveloper/2016/03/30/run-bash-on-ubuntu-on-windows/)

## Disable short-file name generation

With NTFS, user may want to disable `8dot3` as per
[this reference](<https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc778996(v=ws.10)>)
to disable the short-file name generation. It is important to do so for better
performance when the user has over 300K files in a single directory.

## Whitelist in Windows Security

Microsoft includes the Windows Security antivirus program. If user wants to
avoid antivirus scans on specific folders or files to improve the performance,
then whitelist them in Windows Security as per
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
directory.
[Here](https://stackoverflow.com/questions/197162/ntfs-performance-and-large-volumes-of-files-and-directories)
is the resource for reference.
