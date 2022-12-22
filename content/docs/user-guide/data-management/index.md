# Data Management for Machine Learning

<!--
## Data Management for Machine Learning
-->

<toggle>
<tab title="Data access & back up">

Consistent `dvc` data operations. DVC reads a code repo (`git`) to find the
assets.

  <cards>
  <card heading="Manual">

```cli
$ aws s3 cp s3://d/v0 .
$ python cleanup.py
$ python train.py
$ aws s3 cp . s3://d/v0

$ gsutil cp gs://d/a1 .
$ gsutil cp gs://d/b1 .
$ gsutil cp gs://d/c1 .
```

> Ad hoc ingestion and transfers

  </card>
  <card heading="With DVC">

```cli
$ git checkout v0
$ dvc repro
...
$ dvc push -r AS3

$ git checkout v1
$ dvc checkout
$ dvc pull -r GCS
```

> DVC synchronizes your files.

  </card>
  </cards>

</tab>
<tab title="Organization">

DVC applies an automatic file structure via <abbr>caching</abbr>, enabling
[versioning](/doc/user-guide/data-management?tab=Versioning).

  <cards>
  <card heading="Manual">

```cli
dataset.v1/   1.2G
├── file_1
├── ...
└── file_100

dataset.v2/   1.7G
├── file_1
├── ...
└── file_200

TOTAL         2.9G
```

> Bloated project directory

  </card>
  <card heading="With DVC">

```cli
dataset/
├── file_1
└── ... # file links

.dvc/cache
├── ae/39d0c.dir
├── 89/1dbd2
├── 02/1bd68
└── ...

TOTAL         1.7G
```

> Files deduplicated by contents

  </card>
  </cards>

</tab>
<tab title="Versioning">

Data versions and alternatives can be captured in Git (commits, branches, etc.)

  <cards>
  <card heading="Manual">

```cli
2020-data.csv   300M
2021-data.csv   1.7G
model-reg.dat   50M
model-final.dat 51M
m-final-alt.dat 51M
accuracy.json   37K
acc-final.json  36K
recall.json     103K
...
```

> Error-prone file naming

  </card>
  <card heading="With DVC">

```cli
$ git checkout {ver}
$ dvc checkout
```

```cli
data.csv
data.csv.dvc
dvc.yaml
model-reg.dat
performance.json
```

> Clean, lean workspace

  </card>
  </cards>

</tab>
</toggle>
