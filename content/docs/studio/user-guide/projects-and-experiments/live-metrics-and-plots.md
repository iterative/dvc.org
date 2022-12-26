# Generate live (real-time) metrics and plots for experiments

When you
[submit a new experiment](/doc/studio/user-guide/projects-and-experiments/run-experiments)
from Iterative Studio, the
[CI/CD setup](/doc/use-cases/ci-cd-for-machine-learning) in your Git repository
gets invoked. If this setup includes a model training process, it will be
triggered.

In this model training CI action, you can use [DVCLive] to send live updates to
metrics and plots back to Iterative Studio, without writing them to your Git
repository. This will enable you to view all intermediate results in Studio
while your experiment is still running.

This requires a 3-step process:

1. [Set up an access token](#set-up-an-access-token)
2. [Configure your model training CI job](#configure-your-model-training-ci-job)
3. [Send and view the updates](#send-and-view-live-metrics-and-plots)

https://www.youtube.com/watch?v=hKf4twg832g

TODO: Replace this with a video tutorial for live metrics and plots

## Set up an access token

Iterative Studio uses access tokens to authorize [DVCLive] to send live updates
to the metrics and plots. To set up the access token, open your user profile
page. In the `Studio access token` section, click on `Generate new token`. You
can also regenerate or delete your access token.

The option to delete the access token is also available when you try to change
your password. That is, you can reset all your access credentials (your password
and the access token) at once. This is handy if you suspect that your account
security may have been compromised.

## Configure your model training CI job

You should define the following environment variables in your CI job:

- `STUDIO_REPO_URL`: URL for the Git repository connected to the project. E.g.,
  `github:iterative/example-get-started`
- `STUDIO_TOKEN`: Your access token. The access token must be present in any
  request that sends data to the Iterative Studio ingestion endpoint. Requests
  with missing or incorrect access tokens are rejected with an appropriate HTTP
  error code and error message.

One way to provide the above values to your CI job is to set them as GitHub
secrets.

Here is an example GitHub action.

TODO: provide link to an example snippet (such as
[this](https://github.com/iterative/test-dvclive-studio/blob/086a51d76c7983f24c091e1b007820916aa75e7d/.github/workflows/test_live_metrics.yaml#L17-L19))

## Send and view live metrics and plots

In the training CI job (which has been configured as detailed above), whenever
you log your metrics or plots using [DVCLive], they will be automatically sent
to Iterative Studio. Iterative Studio stores the live metrics and plots data in
its database.

In the project table, the live metrics are displayed next to the Git commit
corresponding to the experiment. Updates to the live metrics are highlighted in
orange.

![](https://static.iterative.ai/img/studio/live_metrics_row.png)

Updates to the live metrics are highlighted in orange in the
[compare pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#compare-experiments)
as well.

![](https://static.iterative.ai/img/studio/live_metrics_compare.png)

The number of experiments with new updates to the live metrics values are
displayed in the `Live` icon, which can also be used to filter and show only
running experiments in the table.

Live plots are displayed in the
[plots pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#how-to-generate-plots).

An experiment can have one of the following statuses:

- **Running** - Iterative Studio expects to receive live metrics and plots for
  these experiments. Note that if the experiment stops due to any error,
  Iterative Studio will not be aware of this and it will continue to wait for
  live updates. In this case, you should delete the live metrics row from the
  project table in Iterative Studio.
- **Completed** - Iterative Studio does not expect to receive any more updates
  for these experiments. Once the experiment concludes, you can delete the live
  metrics row from the project table. Iterative Studio does not automatically
  push the final results of your experiment to Git. Your CI action should
  persist the final results in Git.

<admon>

Live metrics and plots sent by DVCLive are displayed in all the projects that
are connected to the Git repository whose URL you have specified in the
`STUDIO_REPO_URL` environment variable.

</admon>

[dvclive]: /doc/dvclive
