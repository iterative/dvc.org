# Asking The Right Questions

"To ask the right question is already half the solution to a problem" -**CG Jung**

When the Kaggle competitions were first introduced back in 2010, everybody quickly 
launched theirt computers and got busy building the most complex architectures of Deep 
Learning models they could think of, only a few took the time to stand back, clean and
study the data provided. And as it was likely to happen that it was these people who in the 
end were proclaimed the winners of the competitions. 

What set these people apart from the majority of the crowd at that point of time was that 
they asked the set of right questions in a time when everyone asked a similar but smaller one. Yes, it is 
an extremely crucial part of design, picking the right model, the right architecture but however, 
these people realized that these weren't the only questions that needed answering.

There is one thing that data scientists seem to agree on around tooling: as engineers,
we'd like to use the same best practices and collaboration software that's standard in 
software engineering. A source code version control system (Git), continuous integration 
services (CI), and unit test frameworks are all expected to be utilized in data science 
pipelines.

And therefore, as with every new technological progress we make, we need to ask a different 
set of questions to account for the introduction of these new methods.

## Questions

### Source code and data versioning

- How do you avoid discrepancies between
  [revisions](https://git-scm.com/docs/revisions) of source code and versions of
  data files, when the data cannot fit into a traditional repository?

### Experiment time log

- How do you track which of your
  [hyperparameter](<https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)>)
  changes contributed the most to producing or improving your target
  [metric](/doc/command-reference/metrics)? How do you monitor the degree of
  each change?

### Navigating through experiments

- How do you recover a model from last week without wasting time waiting for the
  model to retrain?

- How do you quickly switch between a large dataset and a small subset without
  modifying source code?

### Reproducibility

- How do you run a model's evaluation process again without retraining the model
  and preprocessing a raw dataset?

### Managing and sharing large data files

- How do you share models trained in a GPU environment with colleagues who don't
  have access to a GPU?

- How do you share the entire 147 GB of your ML project, with all of its data
  sources, intermediate data files, and models?

Although the answer to some of these quesions have already been answered 
(some of these questions are even part of active research), it is
evident that Data Science as its stands right now, is on shaky grounds. 
