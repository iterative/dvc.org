# Introduction

The DVC user guide constitutes DVC files and directories, DVC file format,
external dependencies, external outputs, update a tracked file, anonymized usage
analytics which are part of basic. Customizations has DVC autocomplete, plugins,
developement version and contributing guide.

Let's understand the relation between basic concepts as you use DVC.

Workspace acts as a current work directory. You would setup the remote using the
dvc config command by setting the type and prefix. Remote setting can be used
for setting the remote data storage or remote code server. This is the basic
requirement for running dvc as a project. DVC has a hidden cache which is
located in `.dvc/cache` directory. For files that are under DVC control it keeps
them and their different versions.
