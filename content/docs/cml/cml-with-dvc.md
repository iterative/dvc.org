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
          dvc plots diff \
            --target classes.csv \
            --template confusion \
            -x actual \
            -y predicted \
            --show-vega master > vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          # Publish regularization function diff
          echo "### Effects of regularization\n" >> report.md
          dvc plots diff \
            --target estimators.csv \
            -x Regularization \
            --show-vega master vega.json
          vl2png vega.json -s 1.5 | cml-publish --md >> report.md

          cml-send-comment report.md
```

If you're using DVC with cloud storage, take note of environmental variables for
your storage format.

<details>

### S3 and S3 compatible storage (Minio, DigitalOcean Spaces, IBM Cloud Object Storage...)

```yaml
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
```

Note that `AWS_SESSION_TOKEN` is optional.

</details>

<details>

### Azure

```yaml
env:
  AZURE_STORAGE_CONNECTION_STRING:
    ${{ secrets.AZURE_STORAGE_CONNECTION_STRING }}
  AZURE_STORAGE_CONTAINER_NAME: ${{ secrets.AZURE_STORAGE_CONTAINER_NAME }}
```

</details>

<details>

### Aliyn

```yaml
env:
  OSS_BUCKET: ${{ secrets.OSS_BUCKET }}
  OSS_ACCESS_KEY_ID: ${{ secrets.OSS_ACCESS_KEY_ID }}
  OSS_ACCESS_KEY_SECRET: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
  OSS_ENDPOINT: ${{ secrets.OSS_ENDPOINT }}
```

</details>

<details>

### Google Cloud Storage

(ℹ️) Normally, `GOOGLE_APPLICATION_CREDENTIALS` points to the path of the
`.json` file that contains the credentials. However, in this context, the
variable contains the content of the file. Copy the text inside the `.json` and
add it as a secret.

```yaml
env:
  GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }}
```

</details>

<details>

### Google Drive

(ℹ️) After configuring your
[Google Drive credentials](https://dvc.org/doc/command-reference/remote/add) you
will find a json file at
`your_project_path/.dvc/tmp/gdrive-user-credentials.json`. Copy the text inside
that `.json` and add it as a secret.

```yaml
env:
  GDRIVE_CREDENTIALS_DATA: ${{ secrets.GDRIVE_CREDENTIALS_DATA }}
```

</details>

## For GitHub Actions Users: Try the `setup-dvc` Action!

The [iterative/setup-dvc](https://github.com/iterative/setup-dvc) action is a
JavaScript action that sets up [DVC](https://dvc.org/) in your workflow.

### Usage

This action can be run on `ubuntu-latest`, `macos-latest`, `windows-latest`.
When running on `windows-latest`, Python 3 is a dependency that should be setup
first (and
[there's an action for that](https://github.com/actions/setup-python)).

Basic usage:

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: iterative/setup-dvc@v1
```

Windows:

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: actions/setup-python@v2
    with:
      python-version: '3.x'

  - uses: iterative/setup-dvc@v1
```

A specific version can be pinned to your workflow using the `version` argument.

```yaml
steps:
  - uses: actions/checkout@v2

  - uses: iterative/setup-dvc@v1
    with:
      version: '1.0.1'
```

### Inputs

The following inputs are supported.

- `version` - (optional) The version of DVC to install. A value of `latest` will
  install the latest version of DVC. Defaults to `latest`.

### Outputs

Setup DVC has no outputs.
