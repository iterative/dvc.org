# import-db

Snapshot and track a dbt model or SQL query results from a database into a
selection of file formats.

```usage
usage: dvc import-db [-h] [-q | -v]
            [--url URL] [--rev [<commit>]] [--project-dir [PROJECT_DIR]]
            [--model MODEL] [--profile PROFILE] [--target TARGET]
            [--sql SQL]
            [--output-format [{csv,json}]] [-o [<path>]] [-f]
            [--conn [CONNECTION]]
```

## Description

In some cases it's convenient to snapshot a file from your ETL/database to be
used in your data pipelines.

`import-db` supports importing your _dbt models_ or sql query results into
different file formats.

To import a _dbt model_, you need to setup a
[Connection Profile](https://docs.getdbt.com/docs/core/connect-data-platform/connection-profiles)
in _dbt_. The _dbt_ repository, which is also a _git repository_, can be
external or shared with _dvc_ on the same _git repository_. If the root of the
_dbt_ repository is not at the same location as _dvc_'s root directory, you can
provide a `--project-dir` relative from your working directory to dbt's root
directory.

If the _dbt_ repository is external, you can provide `--url` and `-rev` to
import the repository from, similar to how `dvc import` does.

You can also override `dbt`'s connection profiles with `--profile` and
`--target` flag. You may need to install appropriate dbt adapter.

Similarly, if you are using dbt and have setup connection profiles, you can use
the same connection profiles to run SQL query and snapshot the results. You'll
have to provide connection profile to use via `--profile` and a sql query
through `--sql`.

You can also set connection strings to connect to a database to run your SQL
query. The connection strings can be setup in config as `db.<name>`. DVC uses
sqlalchemy to connect to the database, so you may need to install appropriate
drivers.

At the moment, `import-db` supports two different output format:

- json records
- csv (with header, and no index)

An _import `.dvc` file_ is created in the same location e.g. `data.txt.dvc` –
similar to using `dvc add` after downloading the data. This makes it possible to
update the import later, if the data source has changed (see `dvc update`).

<admon type="info">

You can `dvc push` and `dvc pull` data imported from the databases to/from
remote storage normally.

</admon>

## Database Connections

For downloading sql query results with `--sql`, dvc will need to either use a
database connection string to connect to a database or use
[dbt's connection profile](#dbts-connection-profiles).

To use a database connection strings to connect to the database, you will need
to configure that in the [`db`] section.

```dvc
dvc config db.pg.url postgresql://user@hostname:port/database
dvc config --local db.pg.password password
```

<admon type="warn" title="Security Alert">
Configure password in a local config file, separately from the connection string.
</admon>

You can pass `--conn <name>` in addition with `--sql <query>` to use that
database connection.

```dvc
dvc import-db --sql 'select * from table' --conn pg
```

Please read [Installing database drivers](#installing-database-drivers) for more
information.

[`db`]: /doc/user-guide/project-structure/configuration#db

## dbt's Connection Profiles

For downloading dbt models using `--model`, dvc reuses dbt's connection
profiles. No additional configuration is necessary if you have setup dbt
already. However, you can use `--profile`/`--target` options to override those
settings. Those can be set in
[`dbt`](/doc/user-guide/project-structure/configuration#dbt) config too.

You can also reuse _dbt_'s connection profiles to run sql query, by specifying a
`--profile` and/or `--target`.

```dvc
dvc import-db --sql 'select * from table' --profile jaffle_shop
```

If you are inside a _dbt_ repository, dvc can discover a default connection
profile setup for your _dbt_ project and use it to run SQL query. No additional
configuration is necessary in this case.

## Installing database drivers

DVC does not come preinstalled with all the drivers for databases, you’ll need
to install the required packages for the database you want to use.

Some of the recommended packages are shown below, with their expected connection
strings:

| **Database**        | **PyPI package**                  | **Connection String**                                                                               |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Amazon Redshift** | `sqlalchemy-redshift`             | `redshift+psycopg2://{username}:{password}@{aws_endpoint}:5439/{database_name}`                     |
| **Big Query**       | `pip install sqlalchemy-bigquery` | `bigquery://{project_id}`                                                                           |
| **Databricks**      | `databricks-sql-connector`        | `databricks://token:{token}@{hostname}:{port}/{database}?http_path={http_path}`                     |
| **MySQL**           | `mysqlclient`                     | `mysql://{username}:{password}@{hostname}/{database_name}`                                          |
| **Oracle**          | `cx_Oracle`                       | `oracle://{username}:{password}@{hostname}/{database_name}`                                         |
| **PostgreSQL**      | `psycopg2`                        | `postgresql://{username}:{password}@{hostname}/{database_name}`                                     |
| **Snowflake**       | `snowflake-sqlalchemy`            | `snowflake://{user}:{password}@{account}.{region}/{database}?role={role}&amp;warehouse={warehouse}` |
| **SQLite**          | -                                 | `sqlite://path/to/file.db?check_same_thread=false`                                                  |
| **SQL Server**      | `pyodbc`                          | `mssql+pyodbc://{username}:{password}@{hostname}:{port}/{database_name}`                            |
| **Trino**           | `trino`                           | `trino://{username}:{password}@{hostname}:{port}/{catalog}`                                         |

DVC uses sqlalchemy internally. So DVC should support any SQL databases that
provide dialects for SQLAlchemy. Refer to their documentation for more details.

## Database Permissions

It is recommended to use an user account with limited access to databases and
tables and one that only has minimal read-only privileges like running `SELECT`
queries. Different databases have different approaches to this. Refer to their
documentation for more details.

## Options

- `-o <path>`, `--out <path>` - specify a `path` to the desired location in the
  workspace to place the file. If unspecified, while downloading a dbt model,
  the filename will be same as the model name, and in case of sql query results,
  the default filename will be `results`, with an extension name added based on
  `--output-format`.
- `--sql <query>` - SQL query to run. If you are not inside a _dbt repository_
  and want to reuse _dbt_'s connection profile, you will need to provide a
  connection profile to use with `--profile`. You can also use a connection
  string set in config, with `--conn`.
- `--model <model_name>` - Model name of the _dbt model_ to download.
- `--conn connection` - Name of the database connection to use. To be only used
  with `--sql` option. The connection has to be set in the
  [config](/doc/user-guide/project-structure/configuration#db).
- `--profile <profile>` - _dbt_ connection profile to use. This can also be set
  in the [config](/doc/user-guide/project-structure/configuration#dbt).
- `--target <target>` - _dbt_ connection profile target to use. This can also be
  set in the [config](/doc/user-guide/project-structure/configuration#dbt).
- `--project-dir` - If _dbt_'s project root is outside dvc's project but within
  the same git repository, you will have to provide a relative path to that
  location. If it is an external dbt repository and if dbt repository is not at
  the root, you will need to provide the path to dbt repository.
- `--url <url>` - URL of the dbt repository to download models from
- `--rev <commit>` - Git revision (e.g. SHA, branch, tag) to checkout from
- `-f`, `--force` - when using `--out` to specify a local target file or
  directory, the operation will fail if those paths already exist. this flag
  will force the operation causing local files/dirs to be overwritten by the
  command.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To illustrate these examples we will be using the <abbr>project</abbr> explained
in the [Get Started](/doc/start).

### Downloading a dbt model

### Downloading sql query result

### Downloading sql query result using dbt's connection

### Downloading external dbt models
