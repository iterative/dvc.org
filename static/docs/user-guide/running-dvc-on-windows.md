# Caveats running DVC on Windows

There can be few performance issues while running DVC on Windows by default. For
some of these issues there are workarounds or configuration options available.
Below are some of these issues detected so far and their workarounds. If you
find any, please let us know!

DVC in general is slower on Windows as compared to other platforms (like
Linux, MacOS, etc.) that show pretty good performance. Upon investigation, it
turns out that most of the delays are coming from [NTFS](https://en.wikipedia.org/wiki/NTFS)
(New Technology File System) not being very good at handling directories with
large number of files. NTFS is a file system that the Windows NT operating
system uses for storing and retrieving files on a hard disk. [Here](https://superuser.com/questions/15192/bad-ntfs-performance)
is the resource for reference.

We can significantly improve performance of DVC on Windows by following
workarounds:

## Disable 8dot3 to improve the way NTFS manages the files

With NTFS, user may want to disable 8dot3 as per
[this](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc778996(v=ws.10))
reference if he finds himself using over 300K files in a single directory. It
enables NTFS to generate shorter file names and changes the way NTFS manages the
files.

## Whitelist in Microsoft Windows Defender

Microsoft includes the Windows Defender antivirus program. If Windows Defender
alerts on DVC or if you want to avoid antivirus scans on your specific folders
or files to improve the performance, whitelist them in Windows Defender as per
[this](https://www.windowscentral.com/how-exclude-files-and-folders-windows-defender-antivirus-scans)
guide.

## Enable long folder/file paths

`dvc pull` may fail in some cases when the folder path is longer than 260
characters. In the Windows API, the maximum allowed length for a path is 260
characters. If required, the user can explicitly enable long paths by following
[this](https://blogs.msdn.microsoft.com/jeremykuhne/2016/07/30/net-4-6-2-and-long-paths-on-windows-10/)
guide.

## Avoid directories with large number of files

The performance of NTFS degrades while handling large volumes of files in a
directory generally over 300k files. [Here](https://stackoverflow.com/questions/197162/ntfs-performance-and-large-volumes-of-files-and-directories)
is the resource for reference.
