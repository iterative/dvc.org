## Intro

When you're starting to build a new machine learning model and you're deciding
on the model architecture, there are a number of issues that arise. You have to
monitor every code change you make, any differences in your data, and any
hyperparameter value updates.

This makes it important for you to be able to track all of these changes so you can reproduce your experiments without wondering how you got your model. Having reproducibility in your training gives you the ability to go back to any point in your process to see which values gave you the best results.

We're going to go through an example of hyperparameter tuning with reproducibility using DVC. You can add this to any existing project you're working on or start from a fresh project.
## Background on Hyperparameters

Before jumping straight into training and experiments, let's briefly go over some background on hyperparameters. Hyperparameters are the values that define your model. This includes things like the number of layers in a neural network or the learning rate for gradient descent.

These parameters are different from model parameters because we can't get them from training our model. They are used to _create_ the model. Optimizing these means running training steps for different kinds of models to see how accurate the results are. We can only get the best hyperparameters from iterating through different values and seeing how they effect our accuracy.

That's why we do hyperparameter tuning. There are a couple common methods that we'll do some code examples with: grid search and random search.

## Tuning with DVC

Let's start by talking about DVC a bit because we'll be using it to add reproducibility to our tuning process. This is the tool we'll be using to track changes in our data, code, and hyperparamters. With DVC, we can add some automation to the tuning process and be able to reproduce it all if we find a really good model.

A few things DVC makes easier to do include:

- Letting you make changes without worrying about finding them later
- Onboarding other engineers to a project
- You get a record of every change without a bunch of Git commits

For hyperparameter tuning, this means you can play with values and code changes without losing track of which changes made the best model. We'll do an example of this with grid search in DVC first.
### Grid Search

Using grid search in hyperparameter tuning means you have an exhaustive list of hyperparameter values you want to cycle through. Grid search will cover every combination of those hyperparameter values.

We're going to show how grid search works with DVC on an NLP project. You can [get the code we're working with in this repo](https://github.com/iterative/example-get-started). It already has DVC set up, but you can check out [the Get Started docs](https://dvc.org/doc/start) if you want to know how the DVC pipeline was created.

### Run an experiment

After you've cloned the repo and installed all of the dependencies, you should be able to open your terminal and run an experiment with the following command.

`dvc exp run`

This will trigger the training process to run and it will record the accuracy of your model. You can check out the results of your experiment with the following command.

`dvc exp show`

This will produce a table similar to this.

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳
┃ Experiment              ┃ Created      ┃ avg_prec ┃ roc_auc ┃ prepare.split ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇
│ workspace               │ -            │ 0.51682  │ 0.93819 │ 0.2           │
│ master                  │ Jun 10, 2021 │ 0.56447  │ 0.94713 │ 0.2           │
│ ├── d03d49e [exp-722c8] │ Jun 12, 2021 │ 0.51682  │ 0.93819 │ 0.2           │
│ ├── 61bacf8 [exp-f14f4] │ Jun 12, 2021 │ 0.58955  │ 0.94289 │ 0.2           │
│ ├── 66de4fa [exp-56c16] │ Jun 12, 2021 │ 0.58571  │ 0.94375 │ 0.2           │
│ ├── 3d19024 [exp-1a0f8] │ Jun 12, 2021 │ 0.59073  │ 0.94257 │ 0.2           │
│ ├── 72a7a07 [exp-f37a4] │ Jun 12, 2021 │ 0.5945   │ 0.94371 │ 0.2           │
│ ├── c51190f [exp-bf4d9] │ Jun 12, 2021 │ 0.59518  │ 0.94622 │ 0.2           │
│ ├── 408a3e1 [exp-95890] │ Jun 12, 2021 │ 0.59229  │ 0.94515 │ 0.2           │
```

Explain queues

Show automated grid search script

Show table

### Random Search

Description of random search

Add this to existing DVC implementation for grid search

Show automated random search script

Show table

## Conclusion

Quick pros/cons of each tuning method

How reproducibility helps with hyperparameter tuning
