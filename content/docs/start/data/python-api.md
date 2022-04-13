## Python API

It's also possible to integrate your data or models directly in source code with
DVC's [Python API](/doc/api-reference). This lets you access the data contents
directly from within an application at runtime. For example:

```py
import dvc.api

with dvc.api.open(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
) as fd:
    # fd is a file descriptor which can be processed normally
```
