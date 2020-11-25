---
name: 'Remote Storage'
match: ['DVC remote', 'remote', 'remote storage']
tooltip: >-
  'DVC [remote storage](/doc/user-guide/glossary/remote-storage) tooltip...'
---

# Remote Storage

<!-- _from `dvc remote`_ -->

What is data remote?

The same way as GitHub provides storage hosting for Git repositories, DVC
remotes provide a location to store and share data and models. You can pull data
assets created by colleagues from DVC remotes without spending time and
resources to build or process them locally. Remote storage can also save space
on your local environment – DVC can [fetch](/doc/command-reference/fetch) into
the <abbr>cache directory</abbr> only the data you need for a specific
branch/commit.

Using DVC with remote storage is optional. DVC commands use the local cache
(usually in dir `.dvc/cache`) as data storage by default. This enables the main
DVC usage scenarios out of the box.

<!-- "...clarify that DVC remotes are not very much like Git remotes. They are cache backups and not distributed copies of the entire DVC repo." #53-->

<!-- cache/remote/workspace relationship #53-->
