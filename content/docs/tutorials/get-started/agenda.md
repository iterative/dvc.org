# Agenda

DVC works **on top of Git repositories** and has a similar command line
interface and Git workflow. You'll need [Git](https://git-scm.com) to run the
commands in this guide. Also, if DVC is not installed, please follow these
[instructions](/doc/install) to do so.

In the next few sections we'll build a simple natural language processing (NLP)
project from scratch. If you'd like to get the final result or have any issues
along the way, you can download the fully reproducible
[GitHub project](https://github.com/iterative/example-get-started) by running:

```dvc
$ git clone https://github.com/iterative/example-get-started
```

Otherwise, bear with us and we'll introduce some basic DVC concepts to get the
same results together!

The idea for this project is a simplified version of our
[Deep Dive Tutorial](/doc/tutorials/deep). It explores the NLP problem of
predicting tags for a given StackOverflow question. For example, we might want a
classifier that can classify (or predict) posts about Python by tagging them
with `python`.

![](/img/example-flow-2x.png)

This is a natural language processing context, but NLP isn't the only area of
data science where DVC can help. DVC is designed to be **Programming language
agnostic**: Python, R, Julia, shell scripts, etc. as well as **ML library
agnostic**: Keras, Tensorflow, PyTorch, Scipy, etc.. If you have data files or
datasets and/or you produce data files, models, or datasets and you want to:

- Capture and save those <abbr>data artifacts</abbr> the same way you capture
  code
- Track and switch between different versions of data easily
- Understand how data artifacts (e.g. ML models) were built in the first place
- Be able to compare models to each other
- Bring software best practices to your team and get everyone on the same page

Then you're in the right place! Click the `Next` button below to start ↘
