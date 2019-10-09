# Agenda

In the next few sections we'll build a simple natural language processing (NLP)
project from scratch. If you'd like to get the final result or have any issues
along the way, you can download the fully reproducible
[GitHub project](https://github.com/iterative/example-get-started) by running:

```dvc
$ git clone https://github.com/iterative/example-get-started
```

Otherwise, bear with us and we'll introduce some basic DVC concepts and get to
the same results together!

The idea of the project is a simplified version of our
[simple text classification tutorial](/doc/tutorials/deep). It explores the NLP
problem of predicting tags for a given StackOverflow question. For example,
let's say we want a classifier that can identify posts about Python by tagging
them with `python`.

![](/static/img/example-flow-2x.png)

This problem is natural language processing related, but NLP isn't the only Data
Science context that DVC can help with. DVC is designed to be agnostic to
frameworks, languages, and problem sets. If you _have_ data files or datasets
and/or you _produce_ data files, models, or datasets and you want to:

- Capture and save those <abbr>data artifacts</abbr> the same way you capture
  code
- Track and switch between different versions of data easily
- Be able to understand how data artifacts (e.g. ML models) were built in the
  first place
- Be able to compare models to one another
- Bring software best practices to your team and get everyone on the same page

Then you're in the right place! Click the `Next` button below to start ↘