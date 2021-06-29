# How DVC Studio Works

[`DVC Studio`](https://studio.iterative.ai/) works with the data, metrics and
hyperparameters that you add to your ML project Git repositories. It works very
closely with your Git ecosystem. Using DVC and Git, you will push all your ML
experiments to your GitHub, GitLab or Bitbucket repositories as Git commits.

When you connect to these repositories from DVC Studio, the project's `dvc.yaml`
is used to identify all the data, metrics and hyperparameters in your
experiments. If you are not using DVC, you can also add the metrics and
hyperparameters to your Git repositories manually.

DVC Studio then creates a view, which is an interactive, tabular representation
of all the identified values. You can also
[run new experiments](/doc/studio/user-guide/run-experiments) from DVC Studio
using your regular CI/CD setup (e.g. GitHub Actions).

This video illustrates how DVC Studio works closely with your Git ecosystem.

https://www.youtube.com/watch?v=5xM5az78Lrg
