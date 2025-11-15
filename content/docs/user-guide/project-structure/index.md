# Project Structure

Using `dvc init` in your <abbr>workspace</abbr> will initialize a <abbr>DVC
project</abbr>, including the internal `.dvc/` directory. From there on, you
will create and manage different DVC metafiles (below), and populate the
<abbr>cache</abbr> with data artifacts as you work on your ML experiments.

- `dvc.yaml` files define stages, parameters, metrics, and plots. Stages form
  the pipeline(s) of a project. Parameters, metrics, and plots are used to
  evaluate and compare project versions and may be defined within stages or
  independently.

- `.dvc` files ("dot DVC files") are placeholders to track data files and
  directories.

- `.dvcignore` files (optional) contain a list of paths for DVC to ignore, which
  can dramatically increase its operational performance.

- Internal files and directories in `.dvc/` contain the local [configuration]
  file(s), default local cache location, and other utilities that DVC needs to
  operate.

[configuration]: /user-guide/project-structure/configuration

<admon type="info">

These metafiles are typically versioned with Git, as DVC does not replace its
distributed version control features, but rather extends on them.

</admon>
