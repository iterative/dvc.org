## Change Params and Reproduce

The whole point of creating this `dvc.yaml` file is the ability to easily
reproduce a pipeline:

```dvc
$ dvc repro
```

<details>

### ⚙️ Expand to have some fun with it.

Let's try to play a little bit with it. First, let's try to change one of the
parameters for the training stage:

1. Open `params.yaml` and change `n_est` to `100`, and
2. (re)run `dvc repro`.

You should see:

```dvc
$ dvc repro
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
Running stage 'train' with command: ...
```

DVC detected that only `train` should be run, and skipped everything else! All
the intermediate results are being reused.

Now, let's change it back to `50` and run `dvc repro` again:

```dvc
$ dvc repro
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
```

As before, there was no need to rerun `prepare`, `featurize`, etc. But this time
it also doesn't rerun `train`! The previous run with the same set of inputs
(parameters & data) was saved in DVC's <abbr>run-cache</abbr>, and reused here.

</details>

<details id="repro-expand-to-see-what-happens-under-the-hood">

### 💡 Expand to see what happens under the hood.

`dvc repro` relies on the <abbr>DAG</abbr> definition from `dvc.yaml`, and uses
`dvc.lock` to determine what exactly needs to be run.

The `dvc.lock` file is similar to a `.dvc` file — it captures hashes (in most
cases `md5`s) of the dependencies and values of the parameters that were used.
It can be considered a _state_ of the pipeline:

```yaml
schema: '2.0'
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - path: data/data.xml
        md5: a304afb96060aad90176268345e10355
      - path: src/prepare.py
        md5: 285af85d794bb57e5d09ace7209f3519
    params:
      params.yaml:
        prepare.seed: 20170428
        prepare.split: 0.2
    outs:
      - path: data/prepared
        md5: 20b786b6e6f80e2b3fcf17827ad18597.dir
```

> `dvc status` command can be used to compare this state with an actual state of
> the workspace.

</details>
