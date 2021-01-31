# Project Structure

Using `dvc init` in your <abbr>workspace</abbr> will start a <abbr>DVC
project</abbr>, including the internal `.dvc/` directory. From there on, you
will create and manage different DVC files and populate the <abbr>cache</abbr>
as you use DVC and work on your data science experiments.

- `dvc.yaml` _pipelines files_ define stages that form the pipeline(s) of a
  project. All stage-based features such as `dvc params`, `dvc metrics`, and
  `dvc plots` are specified here.

- `.dvc` files ("dot DVC files") are placeholders to track data files and
  directories.

- `.dvcignore` files (optional) contain a list of paths for DVC to ignore, which
  can dramatically increase its operational performance.

- Internal files and directories in `.dvc/` contains the local
  [configuration](/doc/command-reference/config) file(s), default local cache
  location, and other utilities that DVC needs to operate.

These metafiles should be versioned with Git (in Git-enabled
<abbr>repositories</abbr>).
