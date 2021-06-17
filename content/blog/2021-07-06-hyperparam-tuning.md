## Intro

When you're starting to build a new machine learning model and you're deciding
on the model architecture, there are a number of issues that arise. You have to
monitor every code change you make, any differences in your data, and any
hyperparameter value updates. This makes it important for you to be able to
track all of these changes so you can reproduce your experiments without
wondering what exactly you changed.

How reproducibility helps

One problem reproducibility helps with: hyperparam tuning

## Background on Hyperparameters

What it is

Why we do it

Common tuning methods

## Tuning with DVC

Introduce DVC in context of reproducibility

Talk about how it versions data, code, and hyperparams

This is how you can add reproducibility and automation to your tuning process

Benefits of reproducibility

Lets you make changes without worrying finding them later

Helps onboard other engineers to a project

You can a record of every change without needing a bunch of Git commits

How this helps with hyperparameter tuning

Lets you play with values and code changes without losing track of which changes
made the best model

Hyperparameter tuning methods

### Grid Search

Description of grid search

Show implementation with DVC

Show experiments running

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
