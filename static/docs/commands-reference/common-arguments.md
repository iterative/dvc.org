# Common Arguments

## Common Options

As you can see, there are four optional arguments that are applicable to any DVC
command. They are

```sh
    -h, --help            show this help message and exit
    -q, --quiet           Be quiet.
    -v, --verbose         Be verbose.
```

Although these optional arguments are pretty self-explanatory, there is a note
for DVC and Git commands that are used together.

* To see Git commands in DVC, you can set logging level to `Debug` (in
`dvc.conf`) or run dvc with option `--verbose`

## Number of DVC Jobs

DVC can benefit from parallel processing and multiple processors/cores when
performing cache push/pull operations.

By default, the number of DVC jobs is set to the number of available CPU cores.
If you would like to change it to any other reasonable value, you could use `-j
(--jobs)` option in DVC commands where applicable.