# Tutorial

This tutorial shows you how to solve a text classification problem using the DVC
tool.

Today the data science community is still lacking good practices for organizing
their projects and effectively collaborating. ML algorithms and methods are no
longer simple _tribal knowledge_ but are still difficult to implement, manage
and reuse.

> One of the biggest challenges in reusing, and hence the managing of ML
> projects, is its reproducibility.

DVC has been built to address the reproducibility.

![](/static/img/reproducibility.png)

Git branches should beautifully reflect the non-linear structure common to the
ML process, where each hypothesis can be presented as a Git branch. However,
inability to store data in a repository and the discrepancy between code and
data make it extremely difficult to manage a data science project with Git.

DVC streamlines large data files and binary models into a single Git environment
and this approach will not require storing binary files in your Git repository.

## DVC Workflow

The diagram below describes all the DVC commands and relationships between local
cache and remote storage.

![](/static/img/flow-large.png)
