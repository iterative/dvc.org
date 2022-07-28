# plots templates

Dump built-in plot templates to JSON files you can customize.

## Synopsis

```usage
usage: dvc plots templates [-h] [-q | -v] [-o <path>]
       [{simple,linear,confusion,confusion_normalized,scatter,smooth}]

positional arguments:
 TEMPLATE    Template to write. Writes all templates by default.
```

## Description

Some times you may need to customize the way `dvc plots` are rendered beyond
what the built-in [plot templates] allow.`dvc plots templates` can dump these
templates to JSON files for you use as base for new templates. To modify them,
use any valid elements of the [Vega-Lite specification].

You can dump a specific built-in template by providing it's name as argument,
for example `dvc plots templates confusion`. Template files are written to
`.dvc/plots` by default, but any location can be set with the `--out` (`-o`)
option.

<admon type="note">

Note that templates can only be used with [data-series plots].

</admon>

[plot templates]:
  https://dvc.org/doc/command-reference/plots#plot-templates-data-series-only
[vega-lite specification]: https://vega.github.io/vega-lite/
[data-series plots]: /doc/command-reference/plots#description

## Options

- `-o <path>`, `--out <path>` - Directory to save templates to.

## Example: Modifying the `simple` template

The built-in `simple` template can be an ideal base for custom templates because
it has a minimal structure you can make quick modifications to. For example,
let's show vertical bars instead of a connected line.

We'll work with the following `data.csv` file:

```csv
y
0.1
0.4
0.9
1.6
```

The simple template renders it like this:

```dvc
$ dvc plots show data.csv --template simple
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_templates_show_unmodified.svg)

Let's dump the `simple` template to the current working directory and rename it
appropriately:

```dvc
$ dvc plots templates simple -o .
Templates have been written into '.'.

$ mv simple.json bars_template.json
```

Now, let's modify the `bars_template.json` file to display the bars (instead of
a line):

```cli
$ cat bars_template.json
```

```git
 {
   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
   ...
   "mark": {
-    "type": "line"
+    "type": "bar"
   },
   "encoding": { ...
   ...
 }
```

And this is how the data looks like using our custom template:

```dvc
$ dvc plots show data.csv --template bars_template.json
file:///Users/usr/src/dvc_plots/index.html
```

![](/img/plots_templates_show_modified.svg)
