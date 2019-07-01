# Caveats running DVC on Windows

There can be few performance issues while running DVC on Windows. Below are some
of these issues detected so far. If you find any, please let us know!

## Caveat 1: DVC binaries are slow on Windows

Running DVC binaries on Windows can take about few seconds to 2 - 3 minutes
depending on the configuration of the system. However, binaries on other
platforms (like Linux, MacOS etc.) show pretty good performance. Upon
investigation, it turns out that most of the delays are coming from
[NTFS](https://en.wikipedia.org/wiki/NTFS) (New Technology File System) not
being very good at handling directories with large number of files. NTFS is a
file system that the Windows NT operating system uses for storing and retrieving
files on a hard disk.

Also, with NTFS user might want to disable 8dot3 as per
[this](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc778996(v=ws.10))
reference if he finds himself using over 300K files in a single directory. It
enables NTFS to generate shorter file names in case the user enters long names.

## Caveat 2: 'dvc pull' may fail to find files in a pushed directories subfolder
## on Windows

`dvc pull` may fail in the cases when the folder path is longer than 260
characters. In the Windows API, the maximum allowed length for a path is 260
characters. So, Windows API can not handle paths longer than 260 characters and
thus, `dvc pull` may fail in such scenarios.

If required, the user can explicitly enable long paths by following
[this](https://blogs.msdn.microsoft.com/jeremykuhne/2016/07/30/net-4-6-2-and-long-paths-on-windows-10/)
guide.
