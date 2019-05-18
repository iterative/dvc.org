# How It Works

1. DVC is a command line tool that works on top of Git:

```dvc
$ cd my_git_repo
$ dvc init
```

2. DVC helps define pipelines of your commands, and keeps all the commands and
   dependencies in a Git repository:

```dvc
$ dvc run -d input.csv -o model.pkl -o results.csv \
          python cnn_train.py --seed 20180227 --epoch 20 \
          input.csv model.pkl results.csv
$ git add model.pkl.dvc
$ git commit -m  "Train CNN. 20 epochs."
```

3. DVC is programming language agnostic. R command example:

```dvc
$ dvc run -d result.csv -o plots.jpg Rscript plot.R result.csv plots.jpg
$ git add plots.jpg.dvc
$ git commit -m "CNN plots"
```

4. DVC can reproduce a pipeline with respect to the pipeline's dependencies:

```dvc
# The input dataset was changed
$ dvc repro plots.jpg.dvc

Reproducing 'model.pkl':
    python cnn_train.py --seed 20180227 --epoch 20 input.csv model.pkl results.csv
Reproducing 'plots.jpg':
    Rscript plot.R result.csv plots.jpg
```

5. DVC introduces the concept of data files to Git repositories. DVC keeps data
   files outside of the repository but retains the metadata in Git:

```dvc
$ git checkout a03_normbatch_vgg16 # checkout code and DVC meta data
$ dvc checkout # checkout data files from the local cache (not Git)
$ ls -l data/ # These LARGE files were copied from DVC cache, not from Git

total 1017488
-r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
-r--------  2 501  staff    12G Jan 27 03:48 Posts-train.tsv
```

6. DVC makes repositories reproducible. DVC metadata can be easily shared
   through any Git server, and allows for experiments to be easily reproduced:

```dvc
$ git clone https://github.com/dataversioncontrol/myrepo.git
$ cd myrepo
# Reproduce data files
$ dvc repro

Reproducing 'output.p':
    python cnn_train.py --seed 20180227 --epoch 20 input.csv model.pkl results.csv
Reproducing 'plots.jpg':
    Rscript plot.R result.csv plots.jpg
```

7. DVC's local cache can be transferred to your colleagues and partners through
   AWS S3, Azure Blob Storage or GCP Storage:

```dvc
$ git push
$ dvc push # push the data cache to the remote storage

# On a colleague machine:
$ git clone https://github.com/dataversioncontrol/myrepo.git
$ cd myrepo
$ git pull # get the data cache from cloud
$ dvc checkout # checkout data files
$ ls -l data/ # You just got gigabytes of data through Git and DVC:

total 1017488
-r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
```

8. DVC works on Mac, Linux ,and Windows.
