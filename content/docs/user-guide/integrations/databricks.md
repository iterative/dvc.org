# Databricks

As of September 2023 Databricks doesn't expose the underlying GIT repo in your
project, so GIT-related DVC functionality within the repo provided by Databricks
is not supported (e.g. [experiments], `--rev/--all-commits/--all-tags/etc`). But
everything will operate as normal if you `git clone` a project yourself or use
remote projects with DVC directly.

## Setup

```bash
%pip install dvc
```

In order to be able to work in the project provided by databricks without GIT
functionality, you'll need to use this workaround:

```bash
!dvc config core.no_scm true --local
```

## DVC API

You can use your existing DVC projects through [Python API] as normal, for
example:

```python
import dvc.api

with dvc.api.open(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry',
) as fobj:
    ...
```

### Secrets

If you need to use secrets to access your data, first add them to databricks
secrets https://docs.databricks.com/en/security/secrets/index.html and then use
them with DVC, for example:

```python
import dvc.api

remote_config = {
    'access_key_id': dbutils.secrets.get(scope='test_scope', key='aws_access_key_id'),
    'secret_access_key': dbutils.secrets.get(scope='test_scope', key='aws_secret_access_key'),
}

with dvc.api.open(
    'recent-grads.csv',
    repo='https://github.com/efiop/mydataregistry',
    remote_config=remote_config
) as fobj:
    ...
```

## Running DVC commands

Databricks doesn't provide a classic terminal, so you'll need to use [magic
commands] to run DVC commands.

### Example: set up shared DVC cache on dbfs

```bash
!dvc config cache.dir /dbfs/dvc/cache
```

### Example: add data

```bash
!dvc add data
```

Note that due to the limitations described in the beginning and `noscm`
workaround, DVC won't be able to automatically add new entries to corresponding
`.gitignore`s, so you'll need to do that manually.

### Example: import data

```bash
!dvc import-url https://archive.ics.uci.edu/static/public/186/wine+quality.zip
```

[experiments]: /doc/start/experiments
[Python API]: /doc/api-reference
[magic commands]:
  https://ipython.readthedocs.io/en/stable/interactive/magics.html
