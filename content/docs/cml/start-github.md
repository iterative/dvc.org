# Get Started with CML on GitHub

Here, we'll walk through a tutorial to start using CML. For simplicity, we'll
show the demo in GitHub Actions, but these instructions are valid for all
supported CI systems (with exceptions as noted!).

1. Fork our
   [example project repository](https://github.com/iterative/example_cml).

   ⚠️ If you are using GitLab,
   [you'll need to create a Personal Access Token](https://github.com/iterative/cml/wiki/CML-with-GitLab#variables)
   for this example to work.

   ![](/img/fork_cml_project.png)

   The following steps can all be done in the GitHub browser interface. However,
   to follow along the commands, we recommend cloning your fork to your local
   workstation:

   ```bash
   git clone https://github.com/<your-username>/example_cml
   ```

2. To create a CML workflow, copy the following into a new file,
   `.github/workflows/cml.yaml`:

   ```yaml
   name: train-my-model
   on: [push]
   jobs:
      run:
         runs-on: [ubuntu-latest]
         container: docker://dvcorg/cml-py3:latest
         steps:
            - uses: actions/checkout@v2
            - name: cml_run
               env:
                  repo_token: ${{ secrets.GITHUB_TOKEN }}
               run: |
                  pip install -r requirements.txt
                  python train.py

                  cat metrics.txt >> report.md
                  cml-publish confusion_matrix.png --md >> report.md
                  cml-send-comment report.md
   ```

3. In your text editor of choice, edit line 16 of `train.py` to `depth = 5`.

4. Commit and push the changes:

   ```bash
   git checkout -b experiment
   git add . && git commit -m "modify forest depth"
   git push origin experiment
   ```

5. In GitHub, open up a Pull Request to compare the `experiment` branch to
   `master`.

   ![](/img/make_pr.png)

   Shortly, you should see a comment from `github-actions` appear in the Pull
   Request with your CML report. This is a result of the function
   `cml-send-comment` in your workflow.

   ![](/img/cml_first_report.png)

This is the gist of the CML workflow: when you push changes to your GitHub
repository, the workflow in your `.github/workflows/cml.yaml` file gets run and
a report generated.

CML functions let you display relevant results from the workflow, like model
performance metrics and vizualizations, in GitHub checks and comments. What kind
of workflow you want to run, and want to put in your CML report, is up to you.

## The CML GitHub Action

In the above example, we got the CML functions thanks to our Docker container.
But there's another way for GitHub Actions users to get CML: the `setup-cml`
Action!

The [iterative/setup-cml](https://github.com/iterative/setup-cml) action is a
JavaScript workflow that provides [CML](https://cml.dev/) functions in your
GitHub Actions workflow. The action allows users to install CML without using
the CML Docker container.

This action gives you:

- Functions like `cml-publish` and `cml-send-comment` for publishing data
  visualization and metrics from your CI workflow as comments in a pull request.
- `cml-runner`, a function that enables workflows to provision cloud and
  on-premise computing resources for training models
- The freedom 🦅 to mix and match CML with your favorite data science tools and
  environments

Note that CML does not include DVC and its dependencies- for that, you want the
[Setup DVC Action](https://github.com/iterative/setup-dvc).

### Usage

This action has been tested on `ubuntu-latest` and `macos-latest`.

Basic usage:

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: iterative/cml-action@v1
```

A specific version can be pinned to your workflow.

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: iterative/setup-cml@v1
    with:
      version: '1.0.1'
```

### Inputs

The following inputs are supported.

- `version` - (optional) The version of CML to install. A value of `latest` will
  install the latest version of CML functions. Defaults to `latest`.

## Outputs

Setup CML has no outputs.

### A complete example

![](https://github.com/iterative/cml/blob/master/imgs/cml_first_report.png) _A
sample CML report from a machine learning project displayed in a Pull Request._

Assume that we have a machine learning script, `train.py`, that outputs an image
`plot.png`.

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: iterative/setup-cml@v1
    with:
      version: latest

  - run: |
      # train will generate plot.png
      python train.py

      echo 'My first CML report' > report.md
      cml-publish plot.png --md > report.md
      cml-send-comment report.md
```
