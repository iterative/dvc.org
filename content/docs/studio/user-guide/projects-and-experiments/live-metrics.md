# Generate real-time (live) metrics for experiments

In your model training CI action, you can use [DVCLive] to send real-time
updates to metrics and plots back to Iterative Studio, without writing them to
your Git repository. This requires a 3-step process:

1. [Set up an access token](#set-up-an-access-token)
2. [Configure the access token in your model training CI job](#configure-the-access-token-in-your-model-training-ci-job)
3. [Send the updates](#send-the-updates)

https://www.youtube.com/watch?v=hKf4twg832g

TODO: Replace this with a video tutorial for live metrics

## Set up an access token

Iterative Studio uses access tokens to authorize DVCLive to send real-time
updates to the metrics and plots.

To set up the access token, open your user profile page. In the
`Studio access token` section, click on `Generate new token`.

You can regenerate the access token at any point. The old access token will no
longer be authorized to send live metrics and plots to Iterative Studio.

You can also delete the access token when you no longer need it.

The option to delete the access token is also available when you try to change
your password. That is, you can reset all your access credentials (your password
and the access token) at once. This is handy if you you suspect that your
account security may have been compromised.

## Configure the access token in your model training CI job

The access token must be provided with any request that sends data to the
Iterative Studio ingestion endpoint. Requests with missing or incorrect access
tokens are rejected with an appropriate HTTP error code and error message.

So, once you generate the access token, you need to make it available in your
model training CI job. One way to do this is to set the Iterative Studio
ingestion endpoint and the access token as environment variables accessible to
your CI job.

The Iterative Studio ingestion endpoint is [TODO: add this url here].

## Send the updates

Next, use [DVCLive] to send metrics and plots directly to Iterative Studio.

Iterative Studio stores the live Metrics in its database. In the project table,
the live metrics are displayed next to the Git commit corresponding to the
experiment. And live plots are displayed in the
[plots pane](/doc/studio/user-guide/projects-and-experiments/visualize-and-compare#how-to-generate-plots).

Once the experiment concludes, live metrics will no longer be displayed for the
experiment. You are expected to persist the final results in Git.

[dvclive]: /doc/dvclive
