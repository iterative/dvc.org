Jupyter notebook
-----------------

DVC allows working with Jupyter notebook. Jupyter notebook is an open sourceweb application
that you can use to create and share documents that contain live code, equations,
visualisations, and text. Jupyter Notebook is maintained by the people at Project Jupyer. You would need jupyter installed while working with Jupyter notebook.

DVC pipeline can takes archives, train a predicton and model and save it as an output.
The pipeline itself is a sequence of transformation we apply to the data file. DVC helps
in describing these transformations and capture actual data involved - input data set
we are processing, intermediate artifacts (useful it transformations take a lot of time
in running), iutput models. With Jupyter Notebook you would split the notebook in multiple
steps and then run on dvc.

## Initialize

Let's setup a Git repository. This step has nothing to do with DVC, it's just a simple preparation:

```
$ mkdir example
$ cd example
$ git init
$ wget https://dvc.org/s3/examples/so/code.zip
$ unzip code.zip
$ rm -f code.zip
$ git add code/
$ git commit -m "initialize the code"
```

Let's create a virtualenv where we would install Jupyter notebook,

```
$ virtualenv venv
$ source venv/bin/activate
$ echo "venv/" >> .gitignore
```

Install the required dependencies:

```
pip install -r code/requirements.txt
```

Install Jupyter

```
pip install jupyter
```

Now we will create pipeline:

- Initialize DVC repository(run it inside Git repository):

  ```
  $ dvc init
  $ git commit -m 'initalize DVC'
  ```

- Download an input data set to the data directory and take it under DVC control:

  ```
	$ mkdir data
	$ wget -P data https://dvc.org/s3/examples/so/Posts.xml.zip
	$ dvc add data/Posts.xml.zip
	```

- Commit the data file meta-information to Git repository:

  ```
	git add data/Posts.xml.zip.dvc data/.gitignore
	git commit -m "add dataset"
	```

	Now you can use what DVC has setup followig the [doc](https://github.com/iterative/dvc.org/blob/d9dc4b42aa2e70aeb1f260f3a7c43779f432997c/static/docs/get-started/example-pipeline.md#define-steps).


## Jupyter and Pipeline

Let's name the sample as sample.dvc.

You should split your pipeline notebook in separate steps.

- Executing the dvc file

  ```
  dvc repro sample.dvc
  ```

- Setup your Jupyter notebook in dvc using

  ```
	dvc run -d sample.ipynb -d src/ -o checkpoints/ -o logs/ jupyter nbconvert sample.ipynb --clear-output --inplace --execute --ExecutePreprocessor.timeout=-1
	```

- Executing a notebook and overwriting in place

  ```
	jupyter nbconvert sample.ipynb --clear-output --inplace --execute --ExecutePreprocessor.timeout=-1
	```

During these steps you can specify the log files and commit in git.
