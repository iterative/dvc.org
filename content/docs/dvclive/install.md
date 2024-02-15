# Install DVClive

<admon type="info">

Note that Python 3.8+ is needed to get the latest version of DVClive.

</admon>

```cli
$ pip install dvclive
```

Depending on the type of the [DVClive methods] you plan to use, you might need
to install optional dependencies:

- install `[image]` to use [`log_image`]
- install `[plots]` to use [`log_plot`]
- install `[sklearn]` to use [`log_sklearn_plot`]
- install `[markdown]` to use [`make_report`] when `report=md` or
  `report=notebook`

If you use one of the supported [ML frameworks], you can also install the
optional dependencies: `[huggingface]`, `[lightning]`, `[tf]`, `[fastai]`,
`[optuna]`, `[xgb]`, `[catalyst]`, `[lgbm]`, `[mmcv]`.

Use `[all]` to include them all.

<details id="example-pip-with-support-for-tensorflow">

[`log_image`]: (https://dvc.org/doc/dvclive/live/log_image)
[`log_plot`]: (https://dvc.org/doc/dvclive/live/log_plot)
[`log_sklearn_plot`]: (https://dvc.org/doc/dvclive/live/log_sklearn_plot)
[`make_report`]: (https://dvc.org/doc/dvclive/live/make_report)

### Example: with support for Tensorflow

```cli
$ pip install "dvclive[tf]"
```

In this case it installs the `tensorflow` library along with DVClive.

</details>

[DVClive methods]: https://dvc.org/doc/dvclive/live#methods
[ML frameworks]: https://dvc.org/doc/dvclive/ml-frameworks
