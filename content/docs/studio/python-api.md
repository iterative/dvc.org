# Python API

The purpose of Studio Python API is to give programmatic access to information
in Studio and executing actions in it.

We provide Studio Python API as a part of DVC python package. To use it, you
need to [install](/doc/install) DVC with `pip` or `conda`.

This reference provides the details about the functions in the `dvc.studio`
module, which can be loaded in any regular way, for example:

```py
import dvc.studio
```

To use this API, you need to
[generate](/doc/studio/user-guide/account-management#studio-access-token) and
[set up](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots#set-up-an-access-token)
Studio access token.

## Download model

Download model binaries for a model from Model Registry. Requires the model to
be stored with DVC with s3 or azure remote. Note, that you need to
[set up remote cloud credentials](/doc/studio/user-guide/account-management#cloud-credentials)
for Studio first.

```py
from dvc.studio.model_registry import download_model
# downloads model to temp directory giving you the path to it
with download_model(
    repo="iterative/demo-bank-customer-churn",
    model="randomforest-model",
    version="v2.0.0"
) as path:
    # load model as usual
    model = load_model(path)
```
