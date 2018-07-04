# DVC Commands Cheat Sheet

Below is the quick summary of the most important commands

* `dvc -h` - Show how to use DVC and show the list of commands.
* `dvc CMD -h` - Display help to use a specific DVC command (CMD).
* `dvc init` - Initialize a new DVC repository.
* `dvc add` - Add data file or data directory. The command converts regular
files to DVC data files.
* `dvc checkout` - Checkout data files and dirs into the working tree. The
command should be executed after `git checkout` or cloning a repository.
* `dvc run` - Generate a DVC file from a given command and execute the command.
The command dependencies and outputs should be specified.
* `dvc pull` - Pull data files from the cloud. Cloud settings for your DVC
environment should be already configured prior to using this command.
* `dvc push` - Push data files to the cloud. Cloud settings should be already
configured.
* `dvc status` - Show status of a data file in the DVC repository.
* `dvc repro` - Reproduce a stage of pipeline. Default stage file is `Dvcfile`.
* `dvc remove` - Remove data file (files or/and folders).
* `dvc gc` - Collect garbage by cleaning DVC cache.
* `dvc config` - Get or set configuration settings (as specified in dvc.conf).
* `dvc show` - Show graphs.
* `dvc fsck` - Data file consistency check.
