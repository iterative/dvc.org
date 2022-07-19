# Iterative Studio

[Iterative Studio](https://studio.iterative.ai/) is a web application that you
can access online or even host on-prem. It works with the data, metrics, and
hyperparameters that you add to your ML project repositories. Using the power of
leading open-source tools DVC, [CML](https://cml.dev), and Git, it enables you
to seamlessly manage data and models, run and track experiments, and visualize
and share results.

<cards>

  <card href="/doc/studio/get-started" heading="Get Started">
    A step-by-step tutorial to get started with Iterative Studio
  </card>

  <card href="/doc/studio/user-guide" heading="User Guide">
    Non-exhaustive list things you can do with Iterative Studio
  </card>

</cards>

## How Studio works

Iterative Studio works with the data, metrics, and hyperparameters in your ML
project repositories. Using DVC and the existing Git ecosystem, you will push
all your ML experiments to GitHub, GitLab, or Bitbucket as Git commits.

https://www.youtube.com/watch?v=5xM5az78Lrg

When you connect DVC repos to Studio, the `dvc.yaml` file is used to identify
all the data, models, etc. available. If you're not using DVC, you can add these
artifacts to Git repos manually.

Studio then creates a [Project], which is an interactive and tabular
representation of your project. You can also [run new ML experiments] from
Studio using your regular CI/CD setup (e.g. GitHub Actions).

[project]: /doc/studio/user-guide/projects
[run new ml experiments]: /doc/studio/user-guide/ml-experiments/run-experiments

## Why use Studio?

- Simplify ML experiment tracking, visualization, and collaboration on top of
  Git.
- Keep your code, data and model connected at all times.
- Apply your existing software engineering stack for ML teams.
- Automate your ML process by transitioning to a no-code interface for running
  experiments on cloud resources of your choice.
