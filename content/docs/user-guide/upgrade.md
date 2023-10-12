# Upgrading from DVC 2.x to 3.0

DVC 3.0 introduced changes to how DVC hashes files and to where DVC-tracked data
is stored in the <abbr>cache</abbr>. DVC 3.0 remains compatible with
pre-existing data tracked by DVC 2.0, but there are a few important points that
users should note when upgrading to DVC 3.0.

<admon type="info">

For a full list of breaking changes in DVC 3.0, please refer to the
[release notes](https://github.com/iterative/dvc/releases/tag/3.0.0).

</admon>

## File hashing changes

Previously, DVC would attempt to identify whether a DVC-tracked file contained
text content, and would convert Windows-style CRLF line endings to Unix-style LF
line endings before hashing the file content (i.e. a
[dos2unix](https://en.wikipedia.org/wiki/Unix2dos) conversion). This behavior
was intended to simplify usage in cross-platform scenarios (where a <abbr>DVC
repository</abbr> was used on both Unix and Windows machines). However, even
though DVC would convert line endings when computing hashes, DVC would still
store the original native content in both local DVC cache and in remote storage.
This would lead to unintended side effects in situations where a given file was
a binary file misidentified as text by DVC or where a text file was not intended
to be cross platform (and CRLF should not have been considered equivalent to
LF).

In DVC 3.0, the line ending conversion behavior has been removed, and DVC treats
all files as if they contain binary data. This means that a text file with CRLF
line endings will always be identified as completely separate from a file
containing LF line endings, even if all other text content in the two files is
identical.

When upgrading to DVC 3.0, users with pipelines that may be run in both Unix and
Windows environments should ensure that any pipeline stages with text outputs
(such as `.csv` or `.tsv` files) generate files with consistent line endings,
regardless of the platform where a stage is run.

<admon type="tip">

For example, Python stages should explicitly generate files with either
Unix-style `\n` or Windows-style `\r\n` line endings, rather than relying on the
default platform specific `os.linesep` behavior.

</admon>

## Optional local cache migration

In order to avoid hash collisions between files tracked in DVC 3.0 and older
releases, files tracked in DVC 3.0 are stored separately from files tracked in
older releases. By default, DVC does not automatically de-duplicate any data
between files tracked in DVC 3.0 and files tracked in older releases. DVC will
still read cached files from DVC 2.0 and will only duplicate for new or modified
data.

Users can manually migrate existing local DVC cache data to the DVC 3.0 location
by running the `dvc cache migrate` command. On most local filesystems,
`dvc cache migrate` is equivalent to forcing the de-duplication of files tracked
in DVC 3.0 and files tracked in older releases. Files from the old cache
location will be re-hashed using the DVC 3.0 hash algorithm, atomically moved to
the new cache location, and then a link will be created from the old location to
the new one. This may take a long time.

<admon type="warn">

On filesystems that do not support any type of
[linking](/doc/user-guide/data-management/large-dataset-optimization#file-link-types-for-the-dvc-cache),
data will be copied from the old cache location into the DVC 3.0 location
(resulting in no de-duplication).

</admon>

By default, `dvc cache migrate` only migrates cache data and does not modify
<abbr>DVC files</abbr> in the <abbr>DVC repository</abbr>.
`dvc cache migrate --dvc-files` will migrate entries in all DVC files in the
repository so that DVC will only use data from the DVC 3.0 cache location.

<admon type="info">

Note that when using `--dvc-files` option, DVC will only migrate DVC files in
<abbr>workspace</abbr> (and Git history will not be re-written).

</admon>

For [DVC remotes](/doc/user-guide/data-magement/remote-storage), there is no
equivalent migration command since it is not possible to link between old and
new locations on many remote filesystems. Instead, once you have migrated data
locally and pushed to the remote, you may use `dvc gc -c` commands to remove
outdated data from the remote.
