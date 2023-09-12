# Manage models

1. Click on the `Models` tab to open the central [Models dashboard]. Iterative
   Studio uses your project's `dvc.yaml` files to identify ML models and
   specially formatted Git tags to identify model versions and stage
   assignments.

   [models dashboard]:
     /doc/studio/user-guide/model-registry/view-and-compare-models#models-dashboard

2. Click on the model name to
   [open its details page](/doc/studio/user-guide/model-registry/view-and-compare-models#model-details-page).

3. You can perform the following actions to manage the lifecycle of models:
   - [Add models to the registry](/doc/studio/user-guide/model-registry/add-a-model)
   - [Register new versions of the models](/doc/studio/user-guide/model-registry/register-version)
     (like `v0.0.1` and `v1.0.0`)
   - [Assign stages to model versions](/doc/studio/user-guide/model-registry/assign-stage)
     (e.g. `dev`, `testing`, `prod`)
   - Use models:
     [download them](/doc/studio/user-guide/model-registry/use-models) or
     [set up CI/CD](/doc/studio/user-guide/model-registry/use-models) to publish
     or deploy models

For more details, check out the
[`model registry user guide`](/doc/studio/user-guide/model-registry/).
