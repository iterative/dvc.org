---
title: Best practices of orchestrating Python and R code in ML projects
date: 2017-09-26
description: |
  What is the best way to integrate R and Python languages in one data science
  project? What are the best practices?
descriptionLong: |
  Today, data scientists are generally divided among two languages — some prefer
  R, some prefer Python. I will try to find an answer to a question: “What is
  the best way to integrate both languages in one data science project? What are
  the best practices?”
picture: 2017-09-26/post-image.jpg
pictureComment: |
  Image was taken from
  [this](http://intersog.com/blog/r-and-python-for-data-science-worthy-opponents/)
  page
author: marija_ilic
commentsUrl: https://discuss.dvc.org/t/best-practices-of-orchestrating-python-and-r-code-in-ml-projects/295
tags:
  - R
  - Python
  - Tutorial
  - Best Practices
---

Beside Git and shell scripting additional tools are developed to facilitate the
development of predictive model in a multi-language environments. For fast data
exchange between R and Python let’s use binary data file format
[Feather](https://blog.rstudio.com/2016/03/29/feather/). Another language
agnostic tool [DVC](http://dvc.org) can make the research reproducible — let’s
use DVC to orchestrate R and Python code instead of a regular shell scripts.

## Machine learning with R and Python

Both R and Python are having powerful libraries/packages used for predictive
modeling. Usually algorithms used for classification or regression are
implemented in both languages and some scientist are using R while some of them
preferring Python. In an example that was explained in previous
[tutorial](https://blog.dataversioncontrol.com/r-code-and-reproducible-model-development-with-dvc-1507a0e3687b)
target variable was binary output and logistic regression was used as a training
algorithm. One of the algorithms that could also be used for prediction is a
popular [Random Forest algorithm](https://en.wikipedia.org/wiki/Random_forest)
which is implemented in both programming languages. Because of performances it
was decided that Random Forest classifier should be implemented in Python (it
shows better performances than random forest package in R).

## R example used for DVC demo

We will use the same example from previous blog
[story](https://blog.dataversioncontrol.com/r-code-and-reproducible-model-development-with-dvc-1507a0e3687b),
add some Python codes and explain how Feather and DVC can simplify the
development process in this combined environment.

Let’s recall briefly the R codes from previous tutorial:

![R Jobs](/uploads/images/2017-09-26/r-jobs.png)_R Jobs_

Input data are StackOverflow posts — an XML file. Predictive variables are
created from text posts — relative importance
[tf-idf](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) of words among all
available posts is calculated. With tf-idf matrices target is predicted and
lasso logistic regression for predicting binary output is used. AUC is
calculated on the test set and AUC metric is used on evaluation.

Instead of using logistic regression in R we will write Python jobs in which we
will try to use random forest as training model. Train_model.R and evaluate.R
will be replaced with appropriate Python jobs.

R codes can be seen
[here](https://blog.dataversioncontrol.com/r-code-and-reproducible-model-development-with-dvc-1507a0e3687b).

Code for `train_model_Python.py` is presented below:

`gist:Zoldin/b312897cc492608feef1eaeae7f6eabc#train_model_Python.py`

Also here we are adding code for `evaluation_python_model.py`:

`gist:Zoldin/9eef13632d0a9039fe9b0dba376516a4#evaluation_python_model.py`

Let’s download necessary R and Python codes from above (clone the
[Github](https://github.com/Zoldin/R_AND_DVC) repository):

```dvc
$ mkdir R_DVC_GITHUB_CODE
$ cd R_DVC_GITHUB_CODE

$ git clone https://github.com/Zoldin/R_AND_DVC
```

Our dependency graph of this data science project look like this:

![R (marked red) and Python (marked pink) jobs in one project](/uploads/images/2017-09-26/our-dependency-graph.png)_R
(marked red) and Python (marked pink) jobs in one project_

Now lets see how it is possible to speed up and simplify process flow with
Feather API and data version control reproducibility.

## Feather API

Feather API is designed to improve meta data and data interchange between R and
Python. It provides fast import/export of data frames among both environments
and keeps meta data information which is an improvement over data exchange via
csv/txt file format. In our example Python job will read an input binary file
that was produced in R with Feather api.

Let’s install Feather library in both environments.

For Python 3 on linux environment you can use cmd and pip3:

```dvc
$ sudo pip3 install feather-format
```

For R it is necessary to install feather package:

```R
install.packages(feather)
```

After successful installation we can use Feather for data exchange.

Below is an R syntax for data frame export with Feather (featurization.R):

```R
library(feather)

write_feather(dtm_train_tfidf,args[3])
write_feather(dtm_test_tfidf,args[4])
print("Two data frame were created with Feather - one for train and one for test data set")
```

Python syntax for reading feather input binary files (train_model_python.py):

```python
import feather as ft

input = sys.argv[1]
df = ft.read_dataframe(input)
```

## Dependency graph with R and Python combined

The next question what we are asking ourselves is why do we need DVC, why not
just use shell scripting? DVC automatically derives the dependencies between the
steps and builds
[the dependency graph (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
transparently to the user. Graph is used for reproducing parts/codes of your
pipeline which were affected by recent changes and we don’t have to think all
the time what we need to repeat (which steps) with the latest changes.

Firstly, with `dvc run` command we will execute all jobs that are related to our
model development. In that phase DVC creates dependencies that will be used in
the reproducibility phase:

```dvc
$ dvc import https://s3-us-west-2.amazonaws.com/dvc-public/data/tutorial/nlp/25K/Posts.xml.zip \
            data/

$ dvc run tar zxf data/Posts.xml.tgz -C data/

$ dvc run Rscript code/parsingxml.R \
                  data/Posts.xml data/Posts.csv

$ dvc run Rscript code/train_test_spliting.R \
                  data/Posts.csv 0.33 20170426 \
                  data/train_post.csv data/test_post.csv

$ dvc run Rscript code/featurization.R \
                  data/train_post.csv \
                  data/test_post.csv data/matrix_train.feather \
                  data/matrix_test.feather

$ dvc run python3 code/train_model_python.py \
                  data/matrix_train.feather \
                  20170426 data/model.p

$ dvc run python3 code/evaluate_python_mdl.py \
                  data/model.p data/matrix_test.feather \
                  data/evaluation_python.txt
```

After this commands jobs are executed and included in DAG graph. Result (AUC
metrics) is written in evaluation_python.txt file:

```dvc
$ cat data/evaluation_python.txt
AUC: 0.741432
```

It is possible to improve our result with random forest algorithm.

We can increase number of trees in the random forest classifier — from 100 to
500:

```python
clf = RandomForestClassifier(n_estimators=500,
                             n_jobs=2,
                             random_state=seed)
clf.fit(x, labels)
```

After commited changes (in `train_model_python.py`) with `dvc repro` command all
necessary jobs for `evaluation_python.txt` reproduction will be re-executed. We
don’t need to worry which jobs to run and in which order.

```dvc
$ git add .
$ git commit
[master a65f346] Random forest classifier — more trees added
    1 file changed, 1 insertion(+), 1 deletion(-)

$ dvc repro data/evaluation_python.txt

Reproducing run command for data item data/model.p. Args: python3 code/train_model_python.py data/matrix_train.txt 20170426 data/model.p
Reproducing run command for data item data/evaluation_python.txt. Args: python3 code/evaluate_python_mdl.py data/model.p data/matrix_test.txt data/evaluation_python.txt
Data item “data/evaluation_python.txt” was reproduced.
```

Beside code versioning, DVC also cares about data versioning. For example, if we
change data sets `train_post.csv` and `test_post.csv` (use different splitting
ratio) DVC will know that data sets are changed and `dvc repro` will re-execute
all necessary jobs for evaluation_python.txt.

```dvc
$ dvc run Rscript code/train_test_spliting.R \
                  data/Posts.csv 0.15 20170426 \
                  data/train_post.csv \
                  data/test_post.csv
```

Re-executed jobs are marked with red color:

![](/uploads/images/2017-09-26/re-executed-jobs.png)

```dvc
$ dvc run Rscript code/train_test_spliting.R \
                  data/Posts.csv 0.15 20170426 \
                  data/train_post.csv \
                  data/test_post.csv

$ dvc repro data/evaluation_python.txt

Reproducing run command for data item data/matrix_train.txt. Args: Rscript — vanilla code/featurization.R data/train_post.csv data/test_post.csv data/matrix_train.txt data/matrix_test.txt
Reproducing run command for data item data/model.p. Args: python3 code/train_model_python.py data/matrix_train.txt 20170426 data/model.p
Reproducing run command for data item data/evaluation_python.txt. Args: python3 code/evaluate_python_mdl.py data/model.p data/matrix_test.txt data/evaluation_python.txt

Data item “data/evaluation_python.txt” was reproduced.

$ cat data/evaluation_python.txt
AUC: 0.793145
```

New AUC result is 0.793145 which shows an improvement compared to previous
iteration.

## Summary

In data science projects it is often used R/Python combined programming.
Additional tools beside git and shell scripting are developed to facilitate the
development of predictive model in a multi-language environments. Using data
version control system for reproducibility and Feather for data interoperability
helps you orchestrate R and Python code in a single environment.
