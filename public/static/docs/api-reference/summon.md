# dvc.api.summon()

Instantiate an object, described in a _summon file_.

## Signature

```py
def summon(
  name,
  repo=None,
  rev=None,
  summon_file="dvcsummon.yaml",
  args=None
)
```

## Parameters

- **`name`** - object to summon within the source project in `repo`, as defined
  in the `summon_file`.

- `repo` - specifies the location of the source DVC project. Both HTTP and SSH
  protocols are supported for online Git repositories (e.g.
  `[user@]server:project.git`). `repo` can also be a local file system path to
  an "offline" project.

- `rev` - (optional)
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). `rev` only has an effect
  when a URL is supplied as parameter to `repo`.

- `summon_file` - YAML file describing the object in question. Defaults to
  `dvcsummon.yaml`.

- `args` - arguments to pass onto the object, if any
