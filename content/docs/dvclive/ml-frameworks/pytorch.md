# PyTorch

DVCLive allows you to add experiment tracking capabilities to your
[PyTorch](https://pytorch.org/) projects.

## Usage

You need to add `Live.log_metric()` calls to each place where you would like to
log metrics and one single `Live.next_step()` call to indicate that the epoch
has ended.

let's consider the following example, extracted from the
[official PyTorch ImageNet example](https://github.com/pytorch/examples/blob/main/imagenet/main.py):

```python
from dvclive import Live

live = Live()

for epoch in range(args.start_epoch, args.epochs):
    lr = adjust_learning_rate(optimizer, epoch, args)
    live.log_metric("learning_rate", lr)

    train_acc1 = train(
        train_loader, model, criterion, optimizer, epoch, args)
    live.log_metric("train/accuracy", train_acc1)

    val_acc1 = validate(val_loader, model, criterion, args)
    live.log_metric("validation/accuracy", val_acc1)

    is_best = val_acc1 > best_acc1
    best_acc1 = max(val_acc1, best_acc1)

    save_checkpoint({
        'epoch': epoch + 1,
        'arch': args.arch,
        'state_dict': model.state_dict(),
        'best_acc1': best_acc1,
        'optimizer' : optimizer.state_dict(),
    }, is_best)

    live.next_step()
```
