# run

Generate a stage file from a given command and execute the command.
The command dependencies and outputs should be specified.

By default, stage file name is `<file>.dvc` where `<file>` is file name of the
first output.

For example, launch Python with a given python script and arguments. Or R script
by Rscript command.

```usage
    usage: dvc run [-h] [-q] [-v] [-d DEPS] [-o OUTS] [-O OUTS_NO_CACHE]
                   [-M METRICS_NO_CACHE] [-f FILE] [-c CWD] [--no-exec] [-y]
                   ...

    positional arguments:
      command               Command or command file to execute

    optional arguments:
      -h, --help            Show this help message and exit
      -q, --quiet           Be quiet.
      -v, --verbose         Be verbose.
      -d DEPS, --deps DEPS  Declare dependencies for reproducible cmd.
      -o OUTS, --outs OUTS  Declare output data file or data directory.
      -O OUTS_NO_CACHE, --outs-no-cache OUTS_NO_CACHE
                            Declare output regular file or directory (sync to
                            Git, not DVC cache).
      -M METRICS_NO_CACHE, --metrics-no-cache METRICS_NO_CACHE
                            Declare output metric file or directory (not cached by
                            DVC).
      -f FILE, --file FILE  Specify name of the stage file. It should be either    
                            'Dvcfile' or have a '.dvc' suffix (e.g. 'prepare.dvc', 
                            'clean.dvc', etc) in order for dvc to be able to find  
                            it later. By default the first output basename + .dvc  
                            is used as a stage filename.                           
      -c CWD, --cwd CWD     Directory within your project to run your command and
                            place state file in
      --no-exec             Only create stage file without actually running it.
      -y, --yes             Automatic 'yes' answer to all prompts. E.g. when
                            '.dvc' file exists and dvc asks if you want to
                            overwrite it.
```

## Examples

Execute a Python script as the DVC pipeline step. Stage file was not specified,
so a `model.p.dvc` stage file will be created:

```dvc
    # Train ML model on the training dataset. 20180226 is a seed value.
    $ dvc run -d matrix-train.p -d train_model.py \
              -o model.p \
              python train_model.py matrix-train.p 20180226 model.p
```

Execute an R script as the DVC pipeline step:

```dvc
    $ dvc run -d parsingxml.R -d Posts.xml \
              -o Posts.csv \
              Rscript parsingxml.R Posts.xml Posts.csv
```

Extract an XML file from an archive to the `data/` folder:

```dvc
    $ mkdir data
    $ dvc run -d Posts.xml.zip \
              -o data/Posts.xml \
              -f extract.dvc \
              unzip Posts.xml.zip -d data/
```
