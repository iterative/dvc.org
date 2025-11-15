# import-db

Snapshot a table or a SQL query results from a database into CSV/JSON format.

```usage
usage: dvc import-db [-h] [-q | -v]
            [--sql sql | --table table] [--conn conn]
            [--output-format [{csv,json}]] [-o [<path>]] [-f]
```

## Description

With `import-db`, you can snapshot your ETL/database to a file to use in your
data pipelines. This commands supports importing your table or a SQL query
results into different file formats. To do so, you have to set connection
strings to connect to a database, which can be setup in config as `db.<name>`.
Check [Database Connections](#database-connections) for more information.

At the moment, `import-db` supports two different output format:

- JSON records
- CSV (with header, and no index)

An _import `.dvc` file_ is created in the same location e.g.
`customers.txt.dvc`. This makes it possible to update the import later, if the
data source has changed (see `dvc update`).

<admon type="info">

You can `dvc push` and `dvc pull` data imported from the databases to/from
remote storage normally.

</admon>

## Database Connections

To connect to a database, DVC needs a database connection string URI. This has
to be configured in the [`db`] section.

```dvc
$ dvc config db.pgsql.url postgresql://user@hostname:port/database
$ dvc config --local db.pgsql.password password
```

<admon type="warn" title="Security Alert">

Configure `password` with `--local` option so they are written to a Git-ignored
config file.

</admon>

<admon type="warn" title="Security Alert">

Use an user account with limited access to databases with read-only privileges,
as `--sql` can run arbitrary queries. Different databases have different
approaches to this. Refer to their documentation for more details.

</admon>

You need to specify the name of database connection to use, when using
`import-db`.

```dvc
$ dvc import-db --table customers_table --conn pgsql
```

In addition to a connection string, DVC needs a driver to connect to the
database. Check [Installing database drivers](#installing-database-drivers) for
connection string format and necessary driver for your specific database.

[`db`]: /user-guide/project-structure/configuration#db

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
| **SQLite**          | -                                 | `sqlite://path/to/file.db`                                                                          |
| **SQL Server**      | `pyodbc`                          | `mssql+pyodbc://{username}:{password}@{hostname}:{port}/{database_name}`                            |
| **Trino**           | `trino`                           | `trino://{username}:{password}@{hostname}:{port}/{catalog}`                                         |

DVC uses [`sqlalchemy`](https://www.sqlalchemy.org/) internally. So DVC should
support any SQL databases that provide dialects for SQLAlchemy. Refer to their
[documentation](https://docs.sqlalchemy.org/en/20/core/engines.html#backend-specific-urls)
for more details.

## Options

- `-o <path>`, `--out <path>` - specify a `path` to the desired location in the
  workspace to place the file. If not specified, the filename will be generated
  using the arguments from `--output-format` and `--table`, or for `--sql`, it
  starts with "results" by default.

- `--table <table>` - table to snapshot.

- `--sql <query>` - execute SQL query and snapshot its result.

- `--output-format` - type of format to materialize into. `csv` (default) and
  `json` is supported.

- `--conn connection` - name of the database connection to use. The connection
  has to be set in the [config](/user-guide/project-structure/configuration#db).

- `-f`, `--force` - when using `--out` to specify a local target file or
  directory, the operation will fail if those paths already exist. this flag
  will force the operation causing local files/dirs to be overwritten by the
  command.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

### Downloading a table

To import a table from a database using a `db` config set:

```dvc
$ dvc import-db --table "customers_table" --conn pgsql
...
```

`dvc import-db` will snapshot the complete table, and save to a file named
`customers_table.csv`. It will also create a `customers_table.csv.dvc` file with
the following contents:

```yaml
md5: ddd4654188815dcae6ce4d4a37f83bde
frozen: true
deps:
  - db:
      file_format: csv
      connection: pgsql
      table: customers_table
outs:
  - md5: 131543a828b297ce0a5925800bd88810
    size: 15084226
    hash: md5
    path: customers_table.csv
```

You can use `dvc update` to update the snapshot.

### Downloading SQL query result

Similarly, you can also snapshot a SQL query result as follows:

```dvc
$ dvc import-db --sql "select * from customers" --conn pgsql
...
```

`dvc import-db` will snapshot the query results, and save to a file named
`results.csv`. Similarly, it will also create a `results.csv.dvc` file, which
can be used to `dvc update` later.
