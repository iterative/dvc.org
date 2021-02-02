# Using CML

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
