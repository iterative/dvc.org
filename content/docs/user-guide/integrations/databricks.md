# Databricks

As of September 2023 Databricks doesn't expose the underlying GIT repo in your
project, so GIT-related DVC functionality within the repo provided by Databricks
is not supported (e.g. [experiments], `--rev/--all-commits/--all-tags/etc`). But
everything will operate as normal if you `git clone` a project yourself or use
remote projects with DVC directly.

## Install

```bash
%pip install dvc
```

## DVC API

You can use your existing DVC projects through [Python API] as normal, for example:

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
commands] to run it, e.g. `!dvc add data`.

[experiments]: /doc/start/experiments
[Python API]: /doc/api-reference
[magic commands]:
  https://ipython.readthedocs.io/en/stable/interactive/magics.html
