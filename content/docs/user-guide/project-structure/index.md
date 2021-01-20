# Project Structure

Using `dvc init` in your <abbr>workspace</abbr> will start a <abbr>DVC
project</abbr>, including the default internal
[`.dvc/`](/doc/user-guide/project-structure/internal-files) directory. From
there on, you will create and manage different DVC files and populate the
<abbr>cache</abbr> as you use DVC and work on your data science experiments.

- `dvc.yaml` files define stages that form the pipeline(s) of a project.

- Files ending with the `.dvc` extension are placeholders to track data files
  and directories.

- `.dvcfiles` contain a list of paths for DVC to ignore, which can dramatically
  increase its operational performance.

These metafiles should be versioned with Git (in Git-enabled
<abbr>repositories</abbr>).
