# DVC Experiments Overview

DVC Experiments are captures automatically by DVC when you [run them]. Each
experiment creates and tracks a project variation based on the changes in your
<abbr>workspace</abbr>. Experiments preserve the latest commit in the current
branch (Git `HEAD`) as their parent or _baseline_, but do not form part of the
regular Git tree or workflow (unless you make them [persistent]).

<details>

### ⚙️ How does DVC track experiments?

Experiments are custom [Git references] (found in `.git/refs/exps`) with a
single commit based on `HEAD` (not checked out by DVC). Note that these commits
are not pushed to Git remotes by default (see `dvc exp push`).

</details>

Experiments will have an auto-generated name like `exp-bfe64` by default. A
custom name can be given instead (using the `--name`/`-n` option of
`dvc exp run`). These names can be used to reference experiments in other
`dvc exp` subcommands.

[run them]: /doc/user-guide/experiment-management/running-experiments
[git references]: https://git-scm.com/book/en/v2/Git-Internals-Git-References

## Basic workflow

`dvc exp` commands let you automatically track a variation to a committed
project version (baseline). You can create independent groups of experiments
this way, as well as review, compare, and restore them later. The basic workflow
goes like this:

- Modify <abbr>parameters</abbr> or other dependencies (input data, source code,
  stage definitions, etc.) of committed stages.
- [Run experiments] with `dvc exp run` (instead of `repro`) to execute the
  pipeline. The results are reflected in your <abbr>workspace</abbr>, and
  tracked automatically.
- Use [metrics](/doc/command-reference/metrics) to identify the best
  experiment(s).
- Review and [compare] experiments with `dvc exp show` or `dvc exp diff`. Repeat
  🔄
- Make certain experiments [persistent] by committing their results to Git. This
  cleans the slate so you can repeat the process later.

[run experiments]: /doc/user-guide/experiment-management/running-experiments
[compare]: /doc/user-guide/experiment-management/comparing-experiments
[persistent]: /doc/user-guide/experiment-management/persisting-experiments
