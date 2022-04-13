## Dependency graphs (DAGs)

By using `dvc stage add` multiple times, and specifying <abbr>outputs</abbr> of
a stage as <abbr>dependencies</abbr> of another one, we can describe a sequence
of commands which gets to a desired result. This is what we call a _data
pipeline_ or
[_dependency graph_](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Let's create a second stage chained to the outputs of `prepare`, to perform
feature extraction:

```dvc
$ dvc stage add -n featurize \
                -p featurize.max_features,featurize.ngrams \
                -d src/featurization.py -d data/prepared \
                -o data/features \
                python src/featurization.py data/prepared data/features
```

The `dvc.yaml` file is updated automatically and should include two stages now.

<details id="pipeline-expand-to-see-what-happens-under-the-hood">

### 💡 Expand to see what happens under the hood.

The changes to the `dvc.yaml` should look like this:

```git
 stages:
   prepare:
     cmd: python src/prepare.py data/data.xml
     deps:
     - data/data.xml
     - src/prepare.py
     params:
     - prepare.seed
     - prepare.split
     outs:
     - data/prepared
+  featurize:
+    cmd: python src/featurization.py data/prepared data/features
+    deps:
+    - data/prepared
+    - src/featurization.py
+    params:
+    - featurize.max_features
+    - featurize.ngrams
+    outs:
+    - data/features
```

</details>

<details>

### ⚙️ Expand to add more stages.

Let's add the training itself. Nothing new this time; just the same `dvc run`
command with the same set of options:

```dvc
$ dvc stage add -n train \
                -p train.seed,train.n_est,train.min_split \
                -d src/train.py -d data/features \
                -o model.pkl \
                python src/train.py data/features model.pkl
```

Please check the `dvc.yaml` again, it should have one more stage now.

</details>

This should be a good time to commit the changes with Git. These include
`.gitignore`, `dvc.lock`, and `dvc.yaml` — which describe our pipeline.
