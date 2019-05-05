DVC on Remote Machine
---------------------

DVC can be run a remote machine. You can have a data remote in DVC. DVC remotess provide
a central place to keep and share data and model files. With a remote data sotroge,
you can pull models and data files created without spending time and resources
in re-build models and re-process files. You can think of DVC remote storage as remote
Git server or GitHub storing and sharing your code. This document describes how you
can ssh in a remote machine and run DVC.

- SSH in remote machine

  ```
	$ ssh root@ip
	```

	You might require a `~/.ssh/id_rsa.pub` while sshing.

- Setup repository

  ```
  $ cd dvc_git_repository
  $ dvc init
	```

  You can also clone a remote git repository using

	```
  $ git clone https://github.com/dataversioncontrol/coderepository.git
  $ cd coderepository
  # Reproduce data files
  $ dev repro
  Reproducing 'output.p':
    python cnn_train.py --seed 20180227 --epoch 20 input.csv model.pkl results.csv
    Reproducing 'plots.jpg':
      Rscript plot.R result.csv plots.jpg
	```

- Get the dataset

  For using `dvc pull` the remote storage should be defined. For an existing project
	a remote can be defined and you can use dvc remote list listing dvc remotes. Let's
	setup an SSH remote with the dvc remote command:

  ```
  $ dvc remote add remote1 ssh://_username_@_host_/path/to/dvc/cache/directory
  $ dvc remote list
  remote1 ssh://_username_@_host_/path/to/dvc/cache/directory
	```

	DVC supports several protocols for remote storage. You can find the information about
	[remote add](https://github.com/iterative/dvc.org/blob/master/static/docs/commands-reference/remote:add.md).

	You can then run a

	```
  $ dvc pull --remote remote1
	```
	or

	```
  $ dvc pull sample.zip.dvc
	```

- Training the models

  You can then run `dvc run` and `dvc repro` which can train the models.
