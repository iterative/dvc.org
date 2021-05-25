# Plotting in offline environments

There may be cases when the user does not have an Internet connection for
various reasons. `dvc plots` - generated HTML will not render properly in these
cases. This guide shows how to fix plotting in offline environments.

DVC will generate HTML file that contains metrics visualizations when using
[plots](/doc/commands-reference/plots). The file contains a JavaScript code that
employs [Vega-Lite](https://vega.github.io/vega-lite/) to present the plot. The
required JavaScript libraries for this HTML file are downloaded from the web:

```html
<script src="https://cdn.jsdelivr.net/npm/vega@5.10.0"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@4.8.1"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6.5.1"></script>
```

DVC allows to provide a custom HTML template to avoid this requirement.

## Example: Setup local server with Vega libraries

We can download the required JavaScript libraries and provide them with a local
HTTP server:

```bash
mkdir local_libs_test
cd local_libs_test

wget https://cdn.jsdelivr.net/npm/vega@5.10.0 -O my_vega.js
wget https://cdn.jsdelivr.net/npm/vega-lite@4.8.1 -O my_vega_lite.js
wget https://cdn.jsdelivr.net/npm/vega-embed@6.5.1 -O my_vega_embed.js

python -m http.server
```

Visiting `http://127.0.0.1:8000` with the browser lists the files in
`local_libs_test` directory.

Now we can return to the DVC project and run the following command to create a
template:

```bash
cat > .dvc/page_template  <<EOF
<html>
<head>
    <script src="http://127.0.0.1:8000/my_vega.js"></script>
    <script src="http://127.0.0.1:8000/my_vega_lite.js"></script>
    <script src="http://127.0.0.1:8000/my_vega_embed.js"></script>
</head>
<body>
	{plot_divs}
</body>
</html>
EOF
```

We create the template similar to an HTML file. The only difference is the
`{plots_div}` marker that identifies the place to put the plot. `<script>` tags
in this HTML file asks the local HTTP server in `127.0.0.1` to serve the
JavaScript files.

Using `dvc plots` with the `--html-template .dvc/page_template` option tells DVC
to produce the visualization using the template we just created.

It's also possible to set the new template as default by `dvc config`:

`dvc config plots.html_template page_template`

The path given to `dvc config` is relative to the project's `.dvc` directory.
