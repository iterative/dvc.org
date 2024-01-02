# import-db

Snapshot SQL query results from a database into CSV/JSON format.

```usage
usage: dvc import-db [-h] [-q | -v]
            [--sql SQL] [--conn [CONNECTION]]
            [--output-format [{csv,json}]] [-o [<path>]] [-f]
```

## Description

With `import-db`, you can snapshot your ETL/database to a file to use in your
data pipelines. This commands supports importing your sql query results into
different file formats. To do so, you have to set connection strings to connect
to a database to run your SQL query. The connection strings can be setup in
config as `db.<name>`. Check [Database Connections] for more information.

At the moment, `import-db` supports two different output format:

- json records
- csv (with header, and no index)

An _import `.dvc` file_ is created in the same location e.g.
`customers.txt.dvc`. This makes it possible to update the import later, if the
data source has changed (see `dvc update`).

<admon type="info">

You can `dvc push` and `dvc pull` data imported from the databases to/from
remote storage normally.

</admon>

## Database Connections

For downloading sql query results with `--sql`, dvc needs to use a database
connection string to connect to a database. This has to be configured in the
[`db`] section.

```dvc
dvc config db.pgsql.url postgresql://user@hostname:port/database
dvc config --local db.pgsql.password password
```

<admon type="warn" title="Security Alert">
Configure password in a local config file, separately from the connection string.
</admon>

You can pass `--conn <name>` in addition with `--sql <query>` to use that
database connection.

```dvc
dvc import-db --sql 'select * from table' --conn pgsql
```

In addition to a connection string, DVC needs a driver to connect to the
database. Check [Installing database drivers] for connection string format and
necessary driver for your specific database.

[`db`]: /doc/user-guide/project-structure/configuration#db

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

DVC uses `sqlalchemy` internally. So DVC should support any SQL databases that
provide dialects for SQLAlchemy. Refer to their documentation for more details.

## Database Permissions

It is recommended to use an user account with limited access to databases and
tables and one that only has minimal read-only privileges like running `SELECT`
queries. Different databases have different approaches to this. Refer to their
documentation for more details.

## Options

- `-o <path>`, `--out <path>` - specify a `path` to the desired location in the
  workspace to place the file. The default filename will be `results`, with an
  extension name added based on `--output-format`.

- `--sql <query>` - SQL query to run. You can also use a connection string set
  in config, with `--conn`.

- `--output-format` - type of format to materialize into. `csv` (default) and
  `json` is supported.

- `--conn connection` - Name of the database connection to use. The connection
  has to be set in the
  [config](/doc/user-guide/project-structure/configuration#db).

- `-f`, `--force` - when using `--out` to specify a local target file or
  directory, the operation will fail if those paths already exist. this flag
  will force the operation causing local files/dirs to be overwritten by the
  command.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

### Downloading sql query result

To import from a database using a `db` config set:

```dvc
$ dvc import-db --sql "select * from customers" --conn pgsql
...
```

`dvc import-db` will snapshot the query results, and save to a file named
`results.csv`. It will also create a `results.csv.dvc` file with the following
contents:

```yaml
md5: ddd4654188815dcae6ce4d4a37f83bde
frozen: true
deps:
  - db:
      file_format: csv
      query: select * from customers
      connection: pgsql
outs:
  - md5: 131543a828b297ce0a5925800bd88810
    size: 15084226
    hash: md5
    path: results.csv
```

You can use `dvc update` to update the snapshot.
