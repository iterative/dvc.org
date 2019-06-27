# Agenda

In the next few sections we will rebuild a simple natural language processing
(NLP) project from scratch. Like we already mentioned, if you'd like to get the
final result or have some issues along the way, you can download the fully
reproducible
[Github DVC project](https://github.com/iterative/example-get-started) here:

```dvc
$ git clone https://github.com/iterative/example-get-started
```

Otherwise, bear with us and we will introduce the basic DVC concepts and get to
the same result together!

The idea of the project is a simplified version of the
[tutorial](/doc/tutorial). It explores the NLP problem of predicting tags for a
given StackOverflow question. For example, we want one classifier which can
predict a post that is about the Python language by tagging it `python`.

![](/static/img/example-flow-2x.png)

Let the NLP nature of the example not to discourage you from using DVC in other
Data Science areas. There was no strong reason behind picking the NLP area. On
contrary, DVC is designed to be pretty agnostic of frameworks, languages, etc.
If you have data files or data sets and/or you produce other data files, models,
data sets and you want to:

- capture and save those data artifacts the same way we capture code,
- track and switch between different versions of these artifacts easily,
- being able to answer the question of how those artifacts or models were built
  in the first place,
- being able to compare them,
- bring best practices to your team and get everyone on the same page.

Then you are in a good place! Click the `Next` button below to start ↘.
