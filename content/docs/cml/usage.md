# Using CML

You'll need a GitHub or GitLab account to begin. Users may wish to familiarize
themselves with [Github Actions](https://help.github.com/en/actions) or
[GitLab CI/CD](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/).
Here, will discuss the GitHub use case.

⚠️ **GitLab users!** Please see our
[docs about configuring CML with GitLab](https://github.com/iterative/cml/wiki/CML-with-GitLab).

🪣 **Bitbucket Cloud users** We support you, too-
[see our docs here](https://github.com/iterative/cml/wiki/CML-with-Bitbucket-Cloud).🪣
_Bitbucket Server support is in the works._

The key file in any CML project is `.github/workflows/cml.yaml`.

```yaml
name: your-workflow-name
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

          # Your ML workflow goes here
          pip install -r requirements.txt
          python train.py

          # Write your CML report
          cat results.txt >> report.md
          cml-send-comment report.md
```

### CML Functions

CML provides a number of helper functions to help package outputs from ML
workflows, such as numeric data and data vizualizations about model performance,
into a CML report. The library comes pre-installed on our
[custom Docker images](https://github.com/iterative/cml/blob/master/docker/Dockerfile).
In the above example, note the field `container: docker://dvcorg/cml-py3:latest`
specifies the CML Docker image with Python 3 will be pulled by the GitHub
Actions runner.

Below is a list of CML functions for writing markdown reports and delivering
those reports to your CI system (GitHub Actions or GitLab CI).

| Function                | Description                                                    | Inputs                                                    |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `cml-send-comment`      | Return CML report as a comment in your GitHub/GitLab workflow. | `<path to report> --head-sha <sha>`                       |
| `cml-send-github-check` | Return CML report as a check in GitHub                         | `<path to report> --head-sha <sha>`                       |
| `cml-publish`           | Publish an image for writing to CML report.                    | `<path to image> --title <image title> --md`              |
| `cml-tensorboard-dev`   | Return a link to a Tensorboard.dev page                        | `--logdir <path to logs> --title <experiment title> --md` |

### Customizing your CML report

CML reports are written in
[GitHub Flavored Markdown](https://github.github.com/gfm/). That means they can
contain images, tables, formatted text, HTML blocks, code snippets and more -
really, what you put in a CML report is up to you. Some examples:

📝 **Text**. Write to your report using whatever method you prefer. For example,
copy the contents of a text file containing the results of ML model training:

```bash
cat results.txt >> report.md
```

🖼️ **Images** Display images using the markdown or HTML. Note that if an image
is an output of your ML workflow (i.e., it is produced by your workflow), you
will need to use the `cml-publish` function to include it a CML report. For
example, if `graph.png` is the output of my workflow `python train.py`, run:

```bash
cml-publish graph.png --md >> report.md
```
