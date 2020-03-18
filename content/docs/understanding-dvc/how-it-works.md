# How It Works

- DVC is a command line tool that works on top of Git:

  ```dvc
  $ cd my_git_repo
  $ dvc init
  ```

  > See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)

- DVC helps define command pipelines, and keeps each command
  [stage](/doc/command-reference/run) and dependencies in a Git repository:

  ```dvc
  $ dvc run -d input.csv -o model.pkl -o results.csv \
          python cnn_train.py --seed 20180227 --epoch 20 \
          input.csv model.pkl results.csv
  $ git add model.pkl.dvc
  $ git commit -m  "Train CNN. 20 epochs."
  ```

- DVC is programming language agnostic. R command example:

  ```dvc
  $ dvc run -d result.csv -o plots.jpg \
            Rscript plot.R result.csv plots.jpg
  $ git add plots.jpg.dvc
  $ git commit -m "CNN plots"
  ```

- DVC can reproduce a pipeline with respect to its dependencies:

  ```dvc
  # The input dataset was changed
  $ dvc repro plots.jpg.dvc

  Reproducing 'model.pkl':
      python cnn_train.py --seed 20180227 --epoch 20 \
            input.csv model.pkl results.csv
  Reproducing 'plots.jpg':
      Rscript plot.R result.csv plots.jpg
  ```

- DVC introduces the concept of data files for Git repositories. DVC keeps data
  files outside of the repository, replacing them with special
  [DVC-files](/doc/user-guide/dvc-file-format) in the Git repo:

  ```dvc
  $ git checkout a03_normbatch_vgg16 # checkout code and DVC-files
  $ dvc checkout # checkout data files from the cache
  $ ls -l data/ # These LARGE files came from the cache, not from Git

  total 1017488
  -r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
  -r--------  2 501  staff    12G Jan 27 03:48 Posts-train.tsv
  ```

- DVC makes repositories reproducible. DVC-files can be easily shared through
  any Git server, and allow for experiments to be easily reproduced:

  ```dvc
  $ git clone https://github.com/example/project.git
  $ cd myrepo
  # Reproduce data files
  $ dvc repro

  Reproducing 'output.p':
      python cnn_train.py --seed 20180227 --epoch 20 \
            input.csv model.pkl results.csv
  Reproducing 'plots.jpg':
      Rscript plot.R result.csv plots.jpg
  ```

- The cache of a DVC project can be shared with colleagues through Amazon S3,
  Microsoft Azure Blob Storage, Google Cloud Storage, among others:

  ```dvc
  $ git push
  $ dvc push # push from the cache to remote storage

  # On a colleague's machine:
  $ git clone https://github.com/example/project.git
  $ cd myrepo
  $ git pull # download tracked data from remote storage
  $ dvc checkout # checkout data files
  $ ls -l data/ # You just got gigabytes of data through Git and DVC:

  total 1017488
  -r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
  ```

- DVC works on MacOS, Linux, and Windows.
