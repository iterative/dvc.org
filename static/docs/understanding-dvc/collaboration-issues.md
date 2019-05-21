# Collaboration Issues in Data Science

Even with all the successes today in machine learning (ML), specifically deep
learning and its applications in business, the data science community is still
lacking good practices for organizing their projects and effectively
collaborating across their varied ML projects. This is a massive challenge for
the community and the industry now, when ML algorithms and methods are no longer
simply "tribal knowledge" but are still difficult to implement, reuse, and
manage.

To make progress in this challenge, many areas of the ML experimentation process
need to be formalized. Many common questions need to be answered in an unified,
principled way:

1. Source code and data versioning.

   - How do you avoid any discrepancies between versions of the source code and
     versions of the data files when the data cannot fit into a repository?

2. Experiment time log.

   - How do you track which of the hyperparameter changes contributed the most
     to producing your target metric? How do you monitor the extent of each
     change?

3. Navigating through experiments.

   - How do you recover a model from last week without wasting time waiting for
     the model to re-train?

   - How do you quickly switch between the large data source and a small data
     subset without modifying source code?

4. Reproducibility.

   - How do you rerun a model's evaluation without re-training the model and
     preprocessing a raw dataset?

5. Managing and sharing large data files.

   - How do you share models trained in a GPU environment with colleagues who do
     not have access to a GPU?

   - How do you share the entire 147 GB of your project, with all of its data
     sources, intermediate data files, and models?

Some of these questions are easy to answer individually. Any data scientist,
engineer, or manager knows or could easily find answers to some of them.
However, the variety of answers and approaches makes data science collaboration
a nightmare. **A systematic approach is required.**
