==================
Using DVC Commands
==================

DVC is a command-line tool.
The typical use case for DVC goes as follows

* In an existing Git repository, initialize a DVC repository with **dvc init**.
* Copy source files for modeling into the repository and convert the files into DVC data files with **dvc add** command.
* Process source data files through your data processing and modeling code using the **dvc run** command.
* Use **--outs** option to specify **dvc run** command outputs which will be converted to DVC data files after the code runs.
* Clone a git repo with the code of your ML application pipeline. However, this will not copy your DVC cache. Use cloud storage settings and **dvc push** to share the cache (data).
* Use **dvc repro** to quickly reproduce your pipeline on a new iteration, after your data item files or source code of your ML application are modified.

========================
DVC Commands Cheat Sheet
========================

Below is the quick summary of the most important commands

* **dvc -h** - Show how to use DVC and show the list of commands.
* **dvc CMD -h** - Display help to use a specific DVC command (CMD).
* **dvc init** - Initialize a new DVC repository.
* **dvc add** - Add data file or data directory. The command converts regular files to DVC data files.
* **dvc checkout** - Checkout data files and dirs into the working tree. The command should be executed after **git checkout** or cloning a repository.
* **dvc run** - Generate a DVC file from a given command and execute the command. The command dependencies and outputs should be specified.
* **dvc pull** - Pull data files from the cloud. Cloud settings for your DVC environment should be already configured prior to using this command.
* **dvc push** - Push data files to the cloud. Cloud settings should be already configured.
* **dvc status** - Show status of a data file in the DVC repository.
* **dvc repro** - Reproduce a stage of pipeline. Default stage file is **Dvcfile**.
* **dvc remove** - Remove data file (files or/and folders).
* **dvc gc** - Collect garbage by cleaning DVC cache.
* **dvc config** - Get or set configuration settings (as specified in dvc.conf).
* **dvc show** - Show graphs.
* **dvc fsck** - Data file consistency check.

=====================
DVC Command Reference
=====================

init
====

This command initializes a DVC environment in a current Git repository.

.. code-block:: shell
   :linenos:

	usage: dvc init [-h] [-q] [-v]
	optional arguments:
	  -h, --help     show this help message and exit
	  -q, --quiet    Be quiet.
	  -v, --verbose  Be verbose.

Example. Creating a new DVC repository::

	$ mkdir tag_classifier
	$ cd tag_classifier

	$ git init
	Initialized empty Git repository in /Users/dmitry/src/tag_classifier/.git/

	$ dvc init
	$ git status
	On branch master

	Initial commit

	Changes to be committed:

	  (use "git rm --cached <file>..." to unstage)

	        new file:   .dvc/.gitignore
	        new file:   .dvc/config

	$ git commit -m 'Init DVC'
	[master (root-commit) 2db4618] Init DVC
	 2 files changed, 41 insertions(+)
	 create mode 100644 .dvc/.gitignore
	 create mode 100644 .dvc/config


add
====

Converts files and directories to DVC data files.

The command does the conversion from a *regular file* to *DVC data file* in a few steps:

1. Calculate the file checksum.
2. Create a cache file in the cache dir *.dvc/cache*.
3. Create a corresponding DVC file.
4. Replace the file with a hardlink to the cache file.

DVC stores the file's last modification timestamp, inode, and the checksum into a global state file *.dvc/state* to reduce time recomputing checksums later.

Note, this command does NOT copy any file contents and will run quickly even for a large files.
Step (2) from the above is also made by hardlinks movement, not file content.
The only heavy step is (1),  which requires checksum calculation.

For directories, the command does the same steps for each file recursively.
To retain information about the directory structure, a corresponding directory will be created in *.dvc/cache*.

.. code-block:: shell
   :linenos:

	usage: dvc add [-h] [-q] [-v] targets [targets ...]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.

Examples:

Convert files into data files::

	$ mkdir raw
	$ cp ~/Downloads/dataset/* raw
	$ ls raw
	Badges.xml          PostLinks.xml           Votes.xml
	$ dvc add raw/Badges.tsv raw/PostLinks.tsv raw/Votes.tsv
	$ ls raw
	Badges.xml          PostLinks.xml           Votes.xml
	Badges.xml.dvc      PostLinks.xml.dvc       Votes.xml.dvc

Note, DVC files are created.


checkout
========

Checkout data files from cache.
This command has to be called after *git checkout* since Git does not handle DVC data files.

The command restores data files from cache to the working tree and removes data files that are no longer on the working tree.

Note, this command does NOT copy any files - DVC uses hardlinks to perform data file restoration.
This is crucial for large files where checking out as a 50Gb file might take a few minutes.
For DVC, it will take less than a second to restore a 50Gb data file.


.. code-block:: shell
	:linenos:

	usage: dvc checkout [-h] [-q] [-v]

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.

Examples.

Checking out a branch example::

	$ git checkout input_100K
	$ dvc checkout
	$ Remove 'data/model.p'
	$ Remove 'data/matrix-train.p'
	$ 'data/Posts-train.tsv': cache file not found

DVC does not report in the output which data files were restored.
However, it reports removed files and files that DVC was unable to restore due to missing cache.
To restore a file with a missing cache, the reproduction command should be called or the cache can be pulled from the cloud.

It might be convenient to assign Git hook to *git checkout*::

	$ echo 'dvc checkout' > .git/hooks/post-checkout
	$ chmod +x .git/hooks/post-checkout
	$ git checkout input_100K  # dvc checkout is not needed anymore
	$ Remove 'data/model.p'
	$ Remove 'data/matrix-train.p'
	$ 'data/Posts-train.tsv': cache file not found

run
===

Generate a stage file from a given command and execute the command.
The command dependencies and outputs should be specified.

By default, stage file name is **<file>.dvc** where **<file>** is file name of the first output.

For example, launch Python with a given python script and arguments. Or R script by Rscript command.

.. code-block:: shell
   :linenos:

	usage: dvc run [-h] [-q] [-v] [-d DEPS] [-o OUTS] [-O OUTS_NO_CACHE] [-f FILE]
	               [-c CWD] [--no-exec]
	               ...

	positional arguments:
	  command               Command or command file to execute

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -d DEPS, --deps DEPS  Declare dependencies for reproducible cmd.
	  -o OUTS, --outs OUTS  Declare output data file or data directory.
	  -O OUTS_NO_CACHE, --outs-no-cache OUTS_NO_CACHE
	                        Declare output regular file or directory (sync to Git,
	                        not DVC cache).
	  -f FILE, --file FILE  Specify name of the state file
	  -c CWD, --cwd CWD     Directory to run your command and place state file in
	  --no-exec             Only create stage file without actually running it

Examples:

Execute a Python script as the DVC pipeline step. Stage file was not specified, so a **model.p.dvc** stage file will be created::

	$ # Train ML model on the training dataset. 20180226 is a seed value.
	$ dvc run -d matrix-train.p -d train_model.py -o model.p python train_model.py matrix-train.p 20180226 model.p


Execute an R script as the DVC pipeline step::

	$ dvc run -d parsingxml.R -d Posts.xml -o Posts.csv Rscript parsingxml.R Posts.xml Posts.csv


Extract an XML file from an archive to the data/ subfolder::

	$ mkdir data
	$ dvc run -d Posts.xml.tgz -o data/Posts.xml tar zxf Posts.xml.tgz -C data/


push
====

This command pushes all data file caches related to the current Git branch to cloud storage.
Cloud storage settings need to be configured.
See cloud storage configuration for more details on how to set up cloud storage.

.. code-block:: shell
   :linenos:

	usage: dvc push [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.

Examples:

Push all data file caches from the current Git branch to cloud::

	$ dvc push
	(1/8): [########################################] 100% 72271bebdf053178a5cce48b4
	(2/8): [########################################] 100% d7208b910d1a40fedc2da5a44
	(3/8): [########################################] 100% 7f6ed2919af9c9e94c32ea13d
	(4/8): [########################################] 100% 5988519f8465218abb23ce0e0
	(5/8): [########################################] 100% 11de13709a78379d253a3d0f5
	(6/8): [########################################] 100% 3f9c7c3ae51db2eed7ba99e6e
	(7/8): [########################################] 100% cfdaa4bba57fa07d81ff96685
	(8/8): [#######################                 ] 57% 1de6178a9dd844e249ba05414


pull
====

This command pulls all data file caches from cloud storage.
Cloud storage settings need to be configured.

.. code-block:: shell
   :linenos:

	usage: dvc pull [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.

Examples:

Pull all files from the current Git branch::

	$ dvc pull
	(1/8): [########################################] 100% 54a6f1787490ba13fb811a46b
	(2/8): [########################################] 100% 5806dc797c08fb6ddd5d97d46
	(3/8): [########################################] 100% 5988519f8465218abb23ce0e0
	(4/8): [########################################] 100% 7f6ed2919af9c9e94c32ea13d
	(5/8): [########################################] 100% 11de13709a78379d253a3d0f5
	(6/8): [########################################] 100% c6f5a256d628e144db4181de8
	(7/8): [########################################] 100% 3f9c7c3ae51db2eed7ba99e6e
	(8/8): [########################################] 100% cfdaa4bba57fa07d81ff96685

status
======

Show mismatches between local cache and cloud cache.

.. code-block:: shell
	:linenos:

	usage: dvc status [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.

Examples:

Show statuses::

	$ dvc status
	        new file:   /Users/dmitry/src/myrepo_1/.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9

repro
=====

Reproduce DVC file and all stages the file depends on (recursively).
Default file name is **Dvcfile**.
However, DVC files can have any name followed by the **.dvc** suffix.

.. code-block:: shell
	:linenos:

	usage: dvc repro [-h] [-q] [-v] [-f] [-s] [targets [targets ...]]

	positional arguments:
		target                DVC file to reproduce.

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-f, --force           Reproduce even if dependencies were not changed.
		-s, --single-item     Reproduce only single data item without recursive dependencies check.

Examples:

Reproduce default stage file::

	$ dvc repro
	Verifying data sources in 'data/Posts.xml.tgz.dvc'
	Reproducing 'Posts.xml.dvc':
	        tar zxf data/Posts.xml.tgz -C data/
	Reproducing 'Posts.tsv.dvc':
	        python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
	Reproducing 'Posts-train.tsv.dvc':
	        python code/split_train_test.py data/Posts.tsv 0.33 20170426 data/Posts-train.tsv data/Posts-test.tsv
	Reproducing 'matrix-train.p.dvc':
	        python code/featurization.py data/Posts-train.tsv data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
	Reproducing 'model.p.dvc':
	        python code/train_model.py data/matrix-train.p 20170426 data/model.p

Reproduce the part of the pipeline where *Posts.tsv.dvc* is the target DVC file::

	$ dvc repro Posts.tsv.dvc
	Reproducing 'Posts.xml.dvc':
	        tar zxf data/Posts.xml.tgz -C data/
	Reproducing 'Posts.tsv.dvc':
	        python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python


remove
======

Remove data file or data directory.

.. code-block:: shell
	:linenos:

	usage: dvc remove [-h] [-q] [-v] targets [targets ...]

	positional arguments:
		targets               Target to remove - file or directory.

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.

Examples:


Remove *matrix-train.p* data file::

	$ dvc remove matrix-train.p



gc
===

This command collects the garbage, removing unused cache files based on the current Git branch.
If a data file was created in a different branch, then it will be removed by gc.
If a data file has a few versions (and, of course. corresponding caches) - all caches except the current one will be removed.

.. code-block:: shell
	:linenos:

	age: dvc gc [-h] [-q] [-v]

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.

Clean up example::

	$ du -sh .dvc/cache/
	7.4G    .dvc/cache/
	$ dvc gc
	'.dvc/cache/27e30965256ed4d3e71c2bf0c4caad2e' was removed
	'.dvc/cache/2e006be822767e8ba5d73ebad49ef082' was removed
	'.dvc/cache/2f412200dc53fb97dcac0353b609d199' was removed
	'.dvc/cache/541025db4da02fcab715ca2c2c8f4c19' was removed
	'.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9' was removed
	'.dvc/cache/7c4521365288d69a03fa22ad3d399f32' was removed
	'.dvc/cache/9ff7365a8256766be8c363fac47fc0d4' was removed
	'.dvc/cache/a86ca87250ed8e54a9e2e8d6d34c252e' was removed
	'.dvc/cache/f64d65d4ccef9ff9d37ea4cf70b18700' was removed
	$ du -sh .dvc/cache/
	3.1G    .dvc/cache/


config
======

Get or set config options. This command reads and overwrites the DVC config file *.dvc/config*.


.. code-block:: shell
	:linenos:

	usage: dvc config [-h] [-q] [-v] [-u] name [value]

	positional arguments:
		name                  Option name
		value                 Option value

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-u, --unset           Unset option

Examples:

Specify an option name to get the option's value from config file::
	$ dvc config config Global.Cloud
	AWS

Overwrite the value::

	$ dvc config Global.Cloud GCP
	$ git add .dvc/config
	$ git commit -m 'Change cloud to GCP'
	[input_100K a4c985f] Change cloud to GCP
	 1 file changed, 1 insertion(+), 1 deletion(-)

show
====

Generate pipeline image for your current project.

.. code-block:: shell
	:linenos:

	usage: dvc show [-h] [-q] [-v] {pipeline} ...

	positional arguments:
		{pipeline}     Use `dvc show CMD` --help for command-specific help
		pipeline              Show pipeline image

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.

Examples:

Show the pipeline image::

	$ dvc show pipeline

fsck
====

Data file consistency check.
By default the commands outputs statuses of all corrupted data files (if any).
Use *--all* option to see statuses of all data files.

The command checks:
1. Cache file name which is equal to the file content checksum when DVC created the file.
2. Checksum from local state file.
3. Checksum regarding DVC files.
4. The actual recomputed checksum. This is a computation heavy command for large data files. Enabled only by *--physical* option.

Data file is considered to be corrupted if one of the checksums does not match all others.


.. code-block:: shell
	:linenos:

	dvc fsck [-h] [-q] [-v] [-p] [-a] [targets [targets ...]]

	positional arguments:
		targets               Data files to check

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-p, --physical        Compute actual md5
		-a, --all             Show all data files including correct ones

Examples.


Check list of corrupted data files::

	$ dvc fsck --physical
	File data/matrix-test.p:
	    Error status:           Checksum missmatch!!!
	    Actual checksum:        7c4521365288d69a03fa22ad3d399f32
	    Cache file name:        7c4521365288d69a03fa22ad3d399f32
	    Local state checksum:   7c4521365288d69a03fa22ad3d399f32
	    Local state mtime:      1517048086.0
	    Actual mtime:           1517048086.0
	    Stage file: eval_auc.txt.dvc
	        Checksum:           7c4521365288d69a03fa22ad3d399f32
	        Type:               Dependency
	    Stage file: matrix-train.p.dvc
	        Checksum:           7c4521365288d69a03fa22ad3d399f32
	        Type:               Output
	        Use cache:          true

Common Arguments
===========================================

Common Options
--------------

As you can see, there are four optional arguments that are applicable to any DVC command. They are

.. code-block:: shell
	:linenos:

	-h, --help            show this help message and exit
	-q, --quiet           Be quiet.
	-v, --verbose         Be verbose.

Although these optional arguments are pretty self-explanatory, there is a note for DVC and Git commands that are used together.

* To see Git commands in DVC, you can set logging level to *Debug* (in **dvc.conf**) or run dvc with option *--verbose*

Number of DVC Jobs
------------------

DVC can benefit from parallel processing and multiple processors/cores when performing cache push/pull operations.

By default, the number of DVC jobs is set to the number of available CPU cores. If you would like to change it to any other reasonable value, you could use *-j (--jobs)* option in DVC commands where applicable.