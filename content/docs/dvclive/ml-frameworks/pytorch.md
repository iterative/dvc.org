# PyTorch

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch](https://pytorch.org/) projects.

## Usage

To start using DVCLive you just need to add few modifications to your training
code in **any** [PyTorch](https://pytorch.org/) project.

You need to add `Live.log()` calls to each place where you would like to log
metrics and one single `Live.next_step()` call to indicate that the epoch has
ended.

let's consider the following example, extracted from the
[official PyTorch ImageNet example](https://github.com/pytorch/examples/blob/master/imagenet/main.py):

```git
+ from dvclive import Live

+ live = Live()

for epoch in range(args.start_epoch, args.epochs):
    lr = adjust_learning_rate(optimizer, epoch, args)
+    live.log("learning_rate", lr)

    train_acc1 = train(
        train_loader, model, criterion, optimizer, epoch, args)
+    live.log("train/accuracy", train_acc1)

    val_acc1 = validate(val_loader, model, criterion, args)
+    live.log("validation/accuracy", val_acc1)

    is_best = val_acc1 > best_acc1
    best_acc1 = max(val_acc1, best_acc1)

    save_checkpoint({
        'epoch': epoch + 1,
        'arch': args.arch,
        'state_dict': model.state_dict(),
        'best_acc1': best_acc1,
        'optimizer' : optimizer.state_dict(),
    }, is_best)

+    live.next_step()
```

This will generate the outputs as described in the
[Get Started](/docs/dvclive/get-started#outputs).

<admon type="tip">

Without requiring additional modifications to your training code, you can use
DVCLive alongside DVC. See [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for
more info.

</admon>
