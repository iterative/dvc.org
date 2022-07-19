# How Iterative Studio Works

[Iterative Studio](https://studio.iterative.ai/) works with the data, metrics,
hyperparameters and model metadata that you add to your ML project Git
repositories. It works very closely with your Git ecosystem. Using DVC and Git,
you will push all your ML experiments to your GitHub, GitLab or Bitbucket
repositories as Git commits. Similarly, using GTO, and possibly MLEM, you will
push all your ML model details to the repositories as Git commits and Git tags.

When you connect to these repositories from Iterative Studio, the project's
`dvc.yaml` is used to identify all the data, metrics and hyperparameters in your
experiments. If you are not using DVC, you can also add the metrics and
hyperparameters to your Git repositories manually. Iterative Studio also
extracts model details from the Git commits and tags.

Iterative Studio then creates an interactive, tabular representation of all the
identified values. You can also
[run new experiments](/doc/studio/user-guide/run-experiments) from Iterative
Studio using your regular CI/CD setup (e.g. GitHub Actions). All identified
models are included in an interactive models dashboard and individual model
details pages.

This video illustrates how Iterative Studio works closely with your Git
ecosystem.

> Note that we have renamed DVC Studio to Iterative Studio and Views to
> Projects.

https://www.youtube.com/watch?v=5xM5az78Lrg
