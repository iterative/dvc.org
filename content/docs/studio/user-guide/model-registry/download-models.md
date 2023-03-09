# Download models

If your model file is DVC-tracked, you can download any of its registered
versions using [dvc get](https://dvc.org/doc/command-reference/get).

```cli
$ dvc get ${GIT_REPO} ${MODEL_PATH} --rev ${GIT_REV}
```

For example, one of the models in the
[bank customer churn demo project](https://github.com/iterative/demo-bank-customer-churn)
is `lightgbm-model`. You can find its registered versions in the
[list of Git tags](https://github.com/iterative/demo-bank-customer-churn/tags).

Suppose you want to dowload the model file for the `lightgbm-model@v2.0.1`
version. In the model details page, you can see that the model file path is
`.mlem/model/lightgbm-model`.

To download the file, you can use the following dvc command:

```cli
$ dvc get https://github.com/iterative/demo-bank-customer-churn .mlem/model/lightgbm-model --rev lightgbm-model@v2.0.1
```

Note that `.mlem/model/lightgbm-model` is the path where the model is registered
using GTO, and not the actual path of the model file (in the remote storage).
