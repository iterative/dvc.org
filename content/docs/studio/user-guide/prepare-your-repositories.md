<admon>

**We have renamed Views to Projects in Iterative Studio.**

</admon>

# Prepare Your Repositories

Iterative Studio creates [projects] by identifying machine learning datasets,
hyperparameters, models and metrics defined in your Git repositories. These
values can be added to a project in two ways:

1.  **Set up DVC in your repositories**: You can use [DVC](https://dvc.org/) and
    Git to version your code, data, and models from your project repositories.
    This avoids bloating your repositories with large volumes of data or huge
    models. These large assets reside in the cloud or other remote storage
    locations. You will simply track their version info in Git.

    DVC also enables you to [store and share your data and model files], [create
    data registries], [create data pipelines], connect them with
    [CML](https://cml.dev) for [CI/CD in machine learning], and so on. Find more
    about the features and benefits of DVC [here](/doc/start).

    Refer to the [DVC documentation](https://dvc.org/doc) to initialize a DVC
    repository.

    <admon type="tip">

    To add model metadata to your repositories, you can use Iterative Studio
    Model Registry, or the underlying [GTO] or [MLEM].

    Iterative Studio Model Registry can also set up DVC for you when
    [importing model files from cloud locations](/doc/studio/user-guide/model-registry/add-a-model).

    </admon>

[gto]: https://mlem.ai/doc/gto
[mlem]: https://mlem.ai/
[store and share your data and model files]:
  /doc/start/data-management/data-versioning#storing-and-sharing
[create data registries]: /doc/use-cases/data-registry
[create data pipelines]: /doc/start/data-management/data-pipelines
[ci/cd in machine learning]: /doc/use-cases/ci-cd-for-machine-learning

2. **Specify custom files with your metrics and parameters**: If you are working
   with a non-DVC repository, you can add the project provided that the metrics
   and hyperparameters are stored in JSON or YAML files. For instance, if you
   have an ML project for which you generate and save metrics either manually or
   using some ML tracking tools, then you can add this project by specifying the
   file (within your Git repo) which contains your saved metrics. Refer to the
   section [on project settings] to learn how to specify the custom files.

## Prepare Your Repositories to Run New Experiments

To run new experiments from Iterative Studio, you should integrate your
repositories with a CI/CD setup that includes a model training process. For
this, create workflow files (such as GitHub Actions) that get triggered on push
or pull request.

You can
[use the wizard provided by Iterative Studio](/doc/studio/user-guide/projects-and-experiments/run-experiments#use-the-iterative-studio-wizard-to-set-up-your-ci-action)
to automatically generate the workflow configuration, or you can write it on
your own.

For more details on how to set up
[CI/CD pipelines for your ML project](/doc/use-cases/ci-cd-for-machine-learning),
refer to [CML](https://cml.dev).

[on project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#non-dvc-repositories
[projects]: /doc/studio/user-guide/projects-and-experiments/what-is-a-project
