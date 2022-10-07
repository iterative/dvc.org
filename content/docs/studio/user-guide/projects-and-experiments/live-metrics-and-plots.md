# Generate live (real-time) metrics and plots for experiments

When you
[submit a new experiment](/doc/studio/user-guide/projects-and-experiments/run-experiments)
from Iterative Studio, the CI/CD setup in your Git repository gets invoked. If
this setup includes a model training process, it will be triggered.

In this model training CI action, you can use [DVCLive] to send live updates to
metrics and plots back to Iterative Studio, without writing them to your Git
repository. This requires a 3-step process:

1. [Set up an access token](#set-up-an-access-token)
2. [Configure your model training CI job](#configure-your-model-training-ci-job)
3. [Send and view the updates](#send-the-updates)

https://www.youtube.com/watch?v=hKf4twg832g

TODO: Replace this with a video tutorial for live metrics and plots

## Set up an access token

Iterative Studio uses access tokens to authorize [DVCLive] to send live updates
to the metrics and plots.

### Generate access token

To set up the access token, open your user profile page. In the
`Studio access token` section, click on `Generate new token`.

### Regenerate access token

You can regenerate the access token at any point. The old access token will no
longer be authorized to send live metrics and plots to Iterative Studio.

### Reset (delete) access token

You can delete the access token when you no longer need it.

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

## Send the updates

In the training CI job (which has been configured as detailed above), whenever
you log your metrics or plots using [DVCLive], they will be automatically sent
to Iterative Studio.

Iterative Studio stores the live metrics and plots data in its database.

## View live metrics and plots

In the project table, the live metrics are displayed next to the Git commit
corresponding to the experiment. Updates to the live metrics are highlighted in
orange. The running experiments themselves are displayed with a `Running`
indicator.

TODO: Add a screenshot of the `Running` indicator

The number of experiments with new updates to the live metrics values are
displayed in the `Live` icon, which can also be used to filter and show only
running experiments in the table.

Live plots are displayed in the
[plots pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#how-to-generate-plots).

An experiment can have one of the following statuses:

- **Running** - Iterative Studio expects to receive live metrics and plots for
  these experiments.
- **Completed** - Iterative Studio does expect to receive any more updates for
  these experiments. Once the experiment concludes, live metrics or plots will
  no longer be displayed for the experiment. You are expected to persist the
  final results in Git. TODO: confirm if this statement is correct.

- **Stopped/Error** - These experiments stopped due to some error.

<admon>

Live metrics and plots sent by DVCLive are displayed in all the projects that
are connected to the Git repository whose URL you have specified in the
`STUDIO_REPO_URL` environment variable.

</admon>

[dvclive]: /doc/dvclive
