# Hugging Face

DVC includes native support for importing and downloading data hosted on the
[Hugging Face Hub](https://huggingface.co/docs/hub/index). Data from a <abbr>DVC
project</abbr> can also be loaded with the Hugging Face
[Datasets](https://huggingface.co/docs/datasets/index) library via the DVC
[Python API](/doc/api-reference).

## Hugging Face Hub

DVC supports importing or downloading data from any Git repository, even
repositories which use [Git-LFS](https://git-lfs.com/) like repositories hosted
on the [Hugging Face Hub](https://huggingface.co/docs/hub/index). Both HTTPS
(`https://huggingface.co/<MODEL>` and SSH (`git@hf.co:<MODEL>`) repository URLs
are supported.

<admon type="tip">

DVC already includes native read-only Git-LFS support, so using DVC to import
and download data from Hugging Face Hub does not require installing Git LFS or
the Hugging Face CLI.

</admon>

<admon type="info">

When using Git over SSH with Hugging Face Hub (i.e. `git@hf.co:<MODEL>` URLs)
you must have a Hugging Face account with a registered SSH key, regardless of
whether the repository is public or private. Using Git over HTTPS to access
public repositories does not require a Hugging Face account. Please refer to the
Hugging Face [documentation](https://huggingface.co/docs/hub/security-git-ssh)
for more information.

This limitation applies to both `dvc get` and `dvc import`.

</admon>

### Setup

```cli
$ pip install dvc
```

### Download data

`dvc get` can be used to download data from Hugging Face Hub. Downloading both
individual files and directories is supported.

Download the `sd_xl_base_1.0` model from
[Stable Diffusion XL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0):

```cli
$ dvc get https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0 sd_xl_base_1.0.safetensors
```

### Import data

`dvc import` can be used to import data from Hugging Face Hub into a <abbr>DVC
project</abbr>. Importing both individual files and directories is supported.

Import the `sd_xl_base_1.0` model from
[Stable Diffusion XL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0):

```cli
$ dvc import https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0 sd_xl_base_1.0.safetensors
```

## Hugging Face Datasets

[Hugging Face Datasets](https://huggingface.co/docs/datasets/index) is a Python
library accessing and sharing datasets. The DVC Python API provides
[DVCFileSystem](/doc/api-reference/dvcfilesystem), an fsspec-compatible
filesystem which can be used with Hugging Face Datasets to load data from a
<abbr>DVC project</abbr>. Please refer to the Hugging Face
[documentation](https://huggingface.co/docs/datasets/main/en/filesystems) for
more detailed information on using fsspec filesystems with Hugging Face
Datasets.

### Setup

```cli
$ pip install datasets dvc
```

### Load DVC data

When DVC is installed in the same Python environment as Hugging Face Datasets,
DVCFileSystem will be used automatically when a `dvc://` filesystem URL is
provided.

<admon type="tip">

Note that `dvc://` URLs contain the path to the file you wish to load, relative
the root of the DVC project. `dvc://` URLs should not contain a Git repository
URL.

The Git repository URL and any additional DVCFileSystem parameters are provided
separately, through the `storage_options` dictionary.

</admon>

Load metrics (`eval/metrics.json`) from the
[example-get-started](https://github.com/iterative/example-get-started)
repository in Hugging Face Datasets:

```python
>>> from datasets import load_dataset
>>> load_dataset(
...   "json",
...   data_files="dvc://eval/metrics.json",
...   storage_options={"url": "https://github.com/iterative/example-get-started.git"},
... )
DatasetDict({
    train: Dataset({
        features: ['avg_prec', 'roc_auc'],
        num_rows: 1
    })
})
```
