# PyTorch

DVCLive allows you to easily add experiment tracking capabilities to your
Pytorch projects.

## About PyTorch

[PyTorch](https://pytorch.org/) is a Python package that provides two high-level
features:

- Tensor computation (like NumPy) with strong GPU acceleration
- Deep neural networks built on a tape-based autograd system

## Usage

To start using DVCLive you just need to add few modifications to your training
code in **any** PyTorch project.

You need to add `dvclive.log()` calls to each place where you would like to log
metrics and one single `dvclive.next_step()` call to indicate that the epoch has
ended.

To ilustrate with some code, extracted from the
[official PyTorch ImageNet example](https://github.com/pytorch/examples/blob/master/imagenet/main.py):

```git
for epoch in range(args.start_epoch, args.epochs):
    lr = adjust_learning_rate(optimizer, epoch, args)
+   dvclive.log("learning_rate", lr)

    train_acc1 = train(
        train_loader, model, criterion, optimizer, epoch, args)
+    dvclive.log("train/accuracy", train_acc1)

    val_acc1 = validate(val_loader, model, criterion, args)
+    dvclive.log("validation/accuracy", val_acc1)

    is_best = val_acc1 > best_acc1
    best_acc1 = max(val_acc1, best_acc1)

    save_checkpoint({
        'epoch': epoch + 1,
        'arch': args.arch,
        'state_dict': model.state_dict(),
        'best_acc1': best_acc1,
        'optimizer' : optimizer.state_dict(),
    }, is_best)

+    dvclive.next_step()
```

This will generate the metrics logs and summaries as described in the
[Get Started](/docs/dvclive/get-started#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.
