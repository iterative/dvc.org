# PyTorch

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch](https://pytorch.org/) projects.

<admon type="tip">

If you are using PyTorch Lightning, check the
[DVCLive - PyTorch Lightning](/doc/dvclive/ml-frameworks/pytorch-lightning)
page.

</admon>

## Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-Quickstart.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

You need to create a [`Live`](/doc/dvclive/live) instance and include calls to
[log data](/doc/dvclive#log-data) and
[update the step number](/doc/dvclive#optionally-update-the-step-number).

This snippet is used inside the Colab Notebook linked above:

```python
from DVCLive import Live

...

with Live(save_dvc_exp=True, report="notebook") as live:

    live.log_params(params)

    for _ in range(params["epochs"]):

        train_one_epoch(
            model, criterion, x_train, y_train, params["lr"], params["weight_decay"]
        )

        # Train Evaluation
        metrics_train, acual_train, predicted_train = evaluate(
            model, x_train, y_train)

        for k, v in metrics_train.items():
            live.log_metric(f"train/{k}", v)

        live.log_sklearn_plot(
            "confusion_matrix",
            acual_train, predicted_train,
            name="train/confusion_matrix"
        )

        # Test Evaluation
        metrics_test, actual, predicted = evaluate(
            model, x_test, y_test)

        for k, v in metrics_test.items():
            live.log_metric(f"test/{k}", v)

        live.log_sklearn_plot(
            "confusion_matrix", actual, predicted, name="test/confusion_matrix"
        )

        live.log_image(
            "misclassified.jpg",
            get_missclassified_image(actual, predicted, mnist_test)
        )

        # Save best model
        if metrics_test["acc"] > best_test_acc:
            torch.save(model.state_dict(), "model.pt")

        live.next_step()

    live.log_artifact("model.pt", type="model", name="pytorch-model")
```
