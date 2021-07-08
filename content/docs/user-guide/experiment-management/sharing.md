# Sharing Experiments

DVC has storing and sharing facilities like remotes or shared cache for tracked
objects. In this section we discuss an alternative way to share the experiments
without committing them to Git history or branch.

## Prepare remotes to share experiments

There are two types of remotes to store experiment objects. Git remotes are the
locations that store Git repositories. A Github/Gitlab/Bitbucket repository is
an example for Git remote.

The other type of remote is the DVC remote which we add to a project using
`dvc remote add` and manage using `dvc remote` subcommands. Basically DVC
remotes have the same structure as <abbr>cache</abbr>, but live in the cloud.
DVC uses these central locations to store and fetch binary files that doesn't
normally fit into Git repositories.

DVC experiments use both kinds of these remotes to store objects.

Experiment objects that are normally tracked in Git are shared using Git
remotes, and files tracked via DVC are shared using (Q: What about neither,
`cache: false` objects and objects tracked both DVC and Git?)

## Pushing experiments to remotes

## Listing experiments in remotes

## Pulling experiments from remotes

---

BELOW is from GS:Experiments

## Sharing Experiment

After committing the best experiments to our Git branch, we can
[store and share](/doc/start/data-and-model-versioning#storing-and-sharing) them
remotely like any other iteration of the pipeline.

```dvc
dvc push
git push
```

<details>

### 💡 Important information on storing experiments remotely.

The commands in this section require both a `dvc remote default` and a
[Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes). A
DVC remote stores the experiment data, and a Git remote stores the code,
parameters, and other metadata associated with the experiment. DVC supports
various types of remote storage (local file system, SSH, Amazon S3, Google Cloud
Storage, HTTP, HDFS, etc.). The Git remote is often a central Git server
(GitHub, GitLab, BitBucket, etc.).

</details>

Experiments that have not been made persistent will not be stored or shared
remotely through `dvc push` or `git push`.

`dvc exp push` enables storing and sharing any experiment remotely.

```dvc
$ dvc exp push gitremote exp-bfe64
Pushed experiment 'exp-bfe64' to Git remote 'gitremote'.
```

`dvc exp list` shows all experiments that have been saved.

```dvc
$ dvc exp list gitremote --all
72ed9cd:
        exp-bfe64
```

`dvc exp pull` retrieves the experiment from a Git remote.

```dvc
$ dvc exp pull gitremote exp-bfe64
Pulled experiment 'exp-bfe64' from Git remote 'gitremote'.
```

> All these commands take a Git remote as an argument. A `dvc remote default` is
> also required to share the experiment data.
