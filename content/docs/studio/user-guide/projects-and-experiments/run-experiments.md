<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Run Experiments

You can change your hyperparameters or select a different dataset and re-run
your model training using Iterative Studio.

## How Iterative Studio runs ML experiments

Iterative Studio uses your regular CI/CD setup (e.g. GitHub Actions) to run the
experiments. This means that to enable experimentation from Iterative Studio,
you should do the following:

1. First,
   [integrate your Git repository with a CI/CD setup that includes model training process](/doc/studio/user-guide/prepare-your-repositories#prepare-your-repositories-to-run-new-experiments).
   You can
   [use the wizard provided by Iterative Studio](/doc/studio/user-guide/projects-and-experiments/run-experiments#use-the-iterative-studio-wizard-to-set-up-your-ci-action)
   to automatically generate the CI script, or you can write it on your own.

2. Then,
   [setup the yaml workflow ENV vars as secrets](https://cml.dev/doc/self-hosted-runners#environment-variables).
   This is needed so that your CI workflow can launch the runner in your desired
   cloud provider.

3. Now, you can
   [submit your experiments from Iterative Studio](#submit-a-new-experiment).
   Each submission will invoke your CI/CD setup, triggering the model training
   process.

> Due to access restrictions, you cannot run experiments on the demo project
> (`example-get-started`) that is provided to you by default. Once you connect
> to your ML project repositories, you can follow the instructions given below
> to run experiments directly from Iterative Studio.

## Use the Iterative Studio wizard to set up your CI action

Select a commit and click **Experiment**. You will see a message that invites
you to set up your CI.

![](https://static.iterative.ai/img/studio/set_up_cml_message.png)

The CI setup wizard has two sections, pre-filled with default values:

- Left section with 2 sets of parameters:

  1. [Configuration of your self-hosted runner, which is used in the `deploy-runner` step of your CI workflow](#configuration-of-your-self-hosted-runner)
  2. [Job script, which is used in the `runner-job` step of your CI workflow](#runners-job)

- Right section which displays the generated yaml to be used in your CI set up.
  It reflects all your input parameters. Use the
  `Copy to clipboard and paste in your CI Workflow file` link to copy the
  generated yaml and create your CI script.

That's it! At this point you should have CML in place within your CI/CD to run
your experiments. After this, proceed with submitting your experiments as
described below.

![](https://static.iterative.ai/img/studio/set_up_cml_full.png)

### Configuration of your self-hosted runner

This step is responsible for launching a self-hosted runner within your cloud
vendor. The parameters listed here are a subset of the parameters for
[CML self-hosted runners](https://cml.dev/doc/self-hosted-runners).

| Parameter  | Meaning                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Spot`     | Whether you want to launch a spot cloud instance, cutting down the costs of your training.                                                                                                                                                                                                        |
| `Cloud`    | Your cloud provider.                                                                                                                                                                                                                                                                              |
| `Region`   | Cloud-vendor specific region or a CML synthetic region (an abstraction across all the cloud vendors).                                                                                                                                                                                             |
| `Type`     | Cloud-vendor specific instance type or a CML synthetic type `M`/`L`/`XL` (an abstraction across all the cloud vendors). `Type` is also tied to GPU behavior. If you choose an instance with a selectable GPU (such as a CML instance type or any GCP instance), the `GPU` parameter will show up. |
| `HDD size` | Hard disk size in GB. We highly recommend you to enter a big enough value (eg, 100) to avoid unexpected runner termination due to hard disk exhaustion.                                                                                                                                           |
| `Reuse`    | Values for the CML flags `reuse` and `reuse-idle`. See all [CML options](https://cml.dev/doc/ref/runner#options) for details                                                                                                                                                                      |
| `Labels`   | Text labels to identify your CML runners from other self hosted runners that you might have.                                                                                                                                                                                                      |

### Runner's job

| Parameter    | Meaning                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Job script` | This is the script needed for your runner to execute your job, which would commonly include training your model. The default template is a very common combination of CML and DVC taking into account that DVC enables you to make the most of Iterative Studio. You can update this script to reflect your exact model training process, whether you use DVC or not. |

## Submit a new experiment

Watch this video for an overview of how you can run experiments from Iterative
Studio, or read below for details.

https://www.youtube.com/watch?v=nXJXR-zBvHQ

_Note that we have renamed DVC Studio mentioned in the above video to Iterative
Studio and Views to Projects._

To run experiments from Iterative Studio, first you need to determine the Git
commit (experiment) on which you want to iterate. Select the commit that you
want to use and click the `Experiment` button. A form will let you specify all
the changes that you want to make to your experiment. On this form, there are 2
types of inputs that you can change:

1. **Input data files**: You can change datasets that are used for model
   training. The list of files that you can change will depend on your ML
   project. For instance, in the `example-get-started` ML project, you can
   change the `data.xml` file. Iterative Studio identifies all the files used in
   your ML project, which means that if you select the
   `Show all input parameters (including hidden)` option, then you can also
   change the hidden files such as the `model.pkl` model file and the
   `scores.json` metrics file. You can also choose not to change any input data
   files if you only wish to change the values of one or more hyperparameters.
2. **Hyperparameters**: Iterative Studio lists all the hyperparameters of your
   ML project and you can change their values as per the new experiment that you
   want to run. For instance, in the `example-get-started` ML project, you can
   change `max_features` (the maximum number of features that the model uses),
   `ngrams`, etc. You can also choose not to change any hyperparameters if you
   only wish to change one or more input data files.

The default values of the input data files and hyperparameters in this form are
extracted from your selected commit.

![](https://static.iterative.ai/img/studio/cml_changes.png)

Once you have made all the required changes, enter your Git commit message and
description.

<admon>

If your CI job creates a new Git commit to write the experiment results to your
Git repository, you may want to hide the Git commit that you created when
submitting the experiment from your project table. In this case, add
`[skip studio]` in the commit message. For details, refer to [Display
preferences -> Hide commits].

</admon>

Then, select the branch to commit to. You can commit to either the base branch
or a new branch. If you commit to a new branch, a Git pull request will
automatically be created from the new branch to the base branch. Now, click on
`Commit changes`.

![](https://static.iterative.ai/img/studio/cml_commit.png)

## What happens after you submit a new experiment

Iterative Studio will
[create the Git commit and pull request](#git-commit-and-pull-request-are-created).
This will [invoke your model training process](#model-training-is-invoked) (if
it is set up). You can
[track the results in real-time](#live-metrics-and-plots-are-tracked). And you
can [save the results in Git](#metrics-plots-and-reports-are-saved-in-git).

### Git commit (and pull request) are created

Iterative Studio will create a Git commit with the changes you submitted. This
commit appears in the project's experiment table. If you had specified a new
branch to commit the changes to, then a new pull request will also be created
from the new branch to the base branch.

### Model training is invoked

If your ML project is integrated with a CI/CD setup (e.g. GitHub Actions), the
CI/CD setup will get invoked. If this setup includes a model training process,
it will be triggered, which means that your ML experiment will run
automatically.

The model training can happen on any cloud or Kubernetes. For more details on
how to set up
[CI/CD pipelines for your ML project](/doc/use-cases/ci-cd-for-machine-learning),
refer to [CML].

### Live metrics and plots are tracked

In your model training CI action, you can use [DVCLive] to [send live updates to
metrics and plots] back to Iterative Studio, without writing them to your Git
repository. The live metrics are displayed alongside the corresponding
experiment commits.

[send live updates to metrics and plots]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots

### Metrics, plots and reports are saved in Git

In your model training CI action, you can save the training results in Git. This
means, once the experiment completes, its metrics will be available in the
project's experiment table. You can then generate plots and trend charts for it,
or compare it with the other experiments.

In your model training CI action, you can also use [CML] to create reports with
metrics, plots or other details. You can access the CML report by clicking on
the `CML report` icon next to the Git commit message in the experiment table.
The `CML Report` tooltip appears over the `CML report` icon on mouse hover.

![](https://static.iterative.ai/img/studio/cml_report_icon.png)

[dvclive]: /doc/dvclive
[cml]: https://cml.dev
[display preferences -> hide commits]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#hide-commits
