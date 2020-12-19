# CML with DVC

In many ML projects, data isn't stored in a Git repository and needs to be
downloaded from external sources. [DVC](https://dvc.org) is a common way to
bring data to your CML runner. DVC also lets you visualize how metrics differ
between commits to make reports like this:

![](/img/dvc_cml_long_report.png)

The `.github/workflows/cml.yaml` file to create this report is:

```yaml
name: train-test
on: [push]
jobs:
  run:
    runs-on: [ubuntu-latest]
    container: docker://dvcorg/cml-py3:latest
    steps:
      - uses: actions/checkout@v2
      - name: cml_run
        shell: bash
        env:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Install requirements
          pip install -r requirements.txt

          # Pull data & run-cache from S3 and reproduce pipeline
          dvc pull data --run-cache
          dvc repro

          # Report metrics
          echo "## Metrics" >> report.md
          git fetch --prune
          dvc metrics diff master --show-md >> report.md

          # Publish confusion matrix diff
          echo -e "## Plots\n### Class confusions" >> report.md
          dvc plots diff --target classes.csv --template confusion -x actual -y predicted --show-vega master > vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          # Publish regularization function diff
          echo "### Effects of regularization\n" >> report.md
          dvc plots diff --target estimators.csv -x Regularization --show-vega master > vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          cml-send-comment report.md
```

If you're using DVC with cloud storage, take note of environmental variables for
your storage format.
