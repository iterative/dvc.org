# Project Structure

Using `dvc init` in your <abbr>workspace</abbr> will initialize a <abbr>DVC
project</abbr>, including the internal `.dvc/` directory. From there on, you
will create and manage different DVC metafiles (below), and populate the
<abbr>cache</abbr> with data artifacts as you work on your ML experiments.

- `dvc.yaml` files define stages that form the pipeline(s) of a project, and
  configure how to evaluate and compare project versions. All comparison
  features such as `dvc params`, `dvc metrics`, and `dvc plots` are specified
  here.

- `.dvc` files ("dot DVC files") are placeholders to track data files and
  directories.

- `.dvcignore` files (optional) contain a list of paths for DVC to ignore, which
  can dramatically increase its operational performance.

- Internal files and directories in `.dvc/` contains the local
  [configuration](/doc/command-reference/config) file(s), default local cache
  location, and other utilities that DVC needs to operate.

<admon type="info">

These metafiles are typically versioned with Git, as DVC does not replace its
distributed version control features, but rather extends on them.

</admon>
