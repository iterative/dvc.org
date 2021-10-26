---
title: 'Visualization'
---

> > ⁉️ This is to show the scope, this document will be updated entirely.

## Visualization with Experiments

To view plots, first specify which arrays to use as the plot axes. We only need
to do this once, and DVC will save our plot configurations.

```dvc
$ dvc plots modify prc.json -x recall -y precision
Modifying stage 'evaluate' in 'dvc.yaml'
$ dvc plots modify roc.json -x fpr -y tpr
Modifying stage 'evaluate' in 'dvc.yaml'
```

Now let's view the plots:

```dvc
$ dvc plots show
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)

Let's save this iteration, so we can compare it later:

> > ⁉️ These will be converted to experiments. So may need to
> > `dvc exp branch/apply` here, instead of committing to Git.

```dvc
$ git add scores.json prc.json roc.json
$ git commit -a -m "Create evaluation stage"
```

Later we will see how to
[compare and visualize different pipeline iterations](#comparing-iterations).
For now, let's see how can we capture another important piece of information
which will be useful for comparison: parameters.
