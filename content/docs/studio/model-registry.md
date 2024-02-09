# Manage models

DVC Studio provides a model registry that you can access by clicking on the
[`Models` tab](https://studio.iterative.ai/user/-/models). Your project's
`dvc.yaml` files are used to identify ML models and
[specially formatted Git tags](/doc/gto/user-guide#git-tags-format) are used to
identify model versions and stage assignments.

To quickly start tracking your models in the DVC Studio model registry:

- Click on `Add a project` to connect DVC Studio to your ML project's Git
  repository.

- In your model training environment, install [DVCLive](/doc/dvclive):

  ```cli
  $ pip install dvclive
  ```

- Use the DVCLive [`log_artifact()`](/doc/dvclive/live/log_artifact) method in
  your model training code:

  ```python
  from dvclive import Live
  with Live() as live:
    live.log_artifact("model.pt", type="model", name="mymodel")
  ```

- Run the training job:

  ```cli
  $ python train.py
  ```

- Once the training completes, commit and push the resultant `dvc.yaml` file to
  your Git repository remote.

- The model will get added to the model registry, and you can click on the
  model's name to open its
  [details page](/doc/studio/user-guide/model-registry/view-and-compare-models#model-details-page).

To walk through an example of how to get started with the model registry, see
[Get Started: Model Registry](/doc/start/model-management/model-registry).

If you don't want to add the model from a Python script, you can also edit
`dvc.yaml` directly and add your model to artifacts section.

## Manage model lifecycle

After adding a model, you can perform the following actions to manage its
lifecycle:

- [Register new versions of the models](/doc/studio/user-guide/model-registry/register-version)
  (like `v0.0.1` and `v1.0.0`)
- [Assign stages to model versions](/doc/studio/user-guide/model-registry/assign-stage)
  (e.g. `dev`, `testing`, `prod`)
- Use models: [download them](/doc/studio/user-guide/model-registry/use-models)
  or [set up CI/CD](/doc/studio/user-guide/model-registry/use-models) to publish
  or deploy models

For more details, check out the
[`model registry user guide`](/doc/studio/user-guide/model-registry/).
