# dvc.api.read()

read(path, repo=None, rev=None, remote=None, mode="r", encoding=None) - returns
the contents of an artifact as a bytes object or a string.

## Arguments

path - a path to an artifact, relative to repo root

repo - a path or git url of a repo

rev - revision, i.e. a branch, a tag, a sha. This only works with an url in repo

remote - a name of a remote to fetch artifact from/give url to mode - a mode
with which we open a file, the only sensible options are r/rt and rb

encoding - an encoding used to decode contents to a string
