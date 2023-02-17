# Generate live (real-time) metrics and plots for remote experiments

In your model training script, you can use [DVCLive] to send live updates to
metrics and plots to Iterative Studio, without writing them to your Git
repository. This will enable you to view all intermediate results in Iterative
Studio while your experiment is still running.

This requires a 3-step process:

1. [Set up an access token](#set-up-an-access-token)
2. [Configure your model training job](#configure-your-model-training-job)
3. [Send and view the updates](#send-and-view-live-metrics-and-plots)

## Set up an access token

Iterative Studio uses access tokens to authorize [DVCLive] to send live updates
to the metrics and plots. To set up the access token, open your user profile
page. In the `Studio access token` section, click on `Generate new token`. You
can also regenerate or delete your access token.

The option to delete the access token is also available when you try to change
your password. That is, you can reset all your access credentials (your password
and the access token) at once. This is handy if you suspect that your account
security may have been compromised.

## Configure your model training job

You should provide the following environment variables to your model training
job:

1.  `STUDIO_TOKEN`: The access token must be present in any request that sends
    data to the Iterative Studio ingestion endpoint. Requests with missing or
    incorrect access tokens are rejected with an appropriate HTTP error code and
    error message.

    If you are running the experiment locally, you can set this environment
    variable when submitting the training job.

    ```
    $ STUDIO_TOKEN=**** dvc exp run
    ```

    If you are running the experiment as part of a CI job, a secure way to
    provide the access token is to create a
    [GitHub secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
    containing the value of the token, and use the secret in your CI job (see
    example below).

    ```
    ...
      steps:
        - name: Train model
          env:
            STUDIO_TOKEN: ${{ secrets.STUDIO_TOKEN }}
    ...
    ```

2.  `STUDIO_REPO_URL`: If you are running the experiment locally, you do not
    need to set this environment variable. But if you are running it in a CI
    job, then you should set the repository url in this format:
    `{remote-type}:{namespace}/{repo-name}`. For example, for the
    `example-get-started` repository in the `iterative` namespace,
    `STUDIO_REPO_URL` should be set to the following value:

    - If you are using GitHub.com, GitLab.com or Bitbucket.org, set it to
      `git@github.com:iterative/example-get-started.git`,
      `git@gitlab.com:iterative/example-get-started.git`,
      `git@bitbucket.org:iterative/example-get-started.git` respectively.
    - If you are using a custom (self-hosted) GitLab server, set it to
      `custom-gitlab:iterative/example-get-started`.
    - If you are using a GitHub enterprise server, set it to
      `github:iterative/example-get-started`.

## Send and view live metrics and plots

In the training job (which has been configured as detailed above), whenever you
log your metrics or plots using [DVCLive], they will be automatically sent to
Iterative Studio. Here is an example of how you can use [DVCLive] in your
training code:

```py
from dvclive import Live

with Live(save_dvc_exp=True) as live:
  for i in range(params["epochs"]):
    ...
    live.log_metric("accuracy", accuracy)
    live.next_step()
  ...
```

<admon>

Using `save_dvc_exp=True` will ensure that
[the results get saved as a DVC experiment even if you do not have a DVC pipeline](/doc/dvclive/how-it-works#track-the-results).

</admon>

<admon>

DVCLive signals the end of the experiment using `live.end()`. Using
`with Live() as live:` or one of the DVCLive integrations for
[ML Frameworks](/doc/dvclive/api-reference/ml-frameworks) ensures that
`live.end()` is automatically called when the experiment concludes.

</admon>

Iterative Studio stores the live metrics and plots data in its database.

In the project table, the live metrics are displayed nested under the parent Git
commit. Updates to the live metrics are highlighted in orange.

![](https://static.iterative.ai/img/studio/live_metrics.gif)

<admon>

The live metrics row for an experiment is displayed only if its parent Git
commit is shown in the project table. So before you run the experiment, make
sure that its parent commit is pushed to Git.

</admon>

Updates to the live metrics are highlighted in orange in the
[compare pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#compare-experiments)
as well.

The number of experiments with new updates to the live metrics values are
displayed in the `Live` icon, which can also be used to filter and show only
running experiments in the table.

Live plots are displayed in the
[plots pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#how-to-generate-plots);
you can see the plots getting populated as Studio receives new updates.

![](https://static.iterative.ai/img/studio/live_plots.gif)

An experiment can have one of the following statuses:

- **Running** - Iterative Studio expects to receive live metrics and plots for
  these experiments. Note that if the experiment stops due to any error,
  Iterative Studio will not be aware of this and it will continue to wait for
  live updates. In this case, you should delete the live metrics row from the
  project table in Iterative Studio.
- **Completed** - Iterative Studio does not expect to receive any more updates
  for these experiments. Once the experiment concludes, you can delete the live
  metrics row from the project table. Iterative Studio does not automatically
  commit and push the final results of your experiment to Git. If you want to
  save the experiment result, you should persist it using appropriate Git
  commands.

<admon>

If there are multiple projects connected to a single Git repository, then live
metrics and plots for this repository are displayed in all its connected
projects.

</admon>

[dvclive]: /doc/dvclive
