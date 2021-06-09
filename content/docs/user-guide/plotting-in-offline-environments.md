# Plotting in offline environments

There may be cases when the user does not have an Internet connection for
various reasons. `dvc plots` - generated HTML will not render properly in these
cases. This guide shows how to fix plotting in offline environments.

DVC will generate HTML file that contains metrics visualizations when using
[plots](/doc/commands-reference/plots). The file contains references to employ
[Vega-Lite](https://vega.github.io/vega-lite/) in plots. In a standard
environment, the required JavaScript libraries for this HTML file are downloaded
from the web:

```html
<script src="https://cdn.jsdelivr.net/npm/vega@5.10.0"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@4.8.1"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6.5.1"></script>
```

When using the plots without Internet connection, we need to provide these
scripts locally.

You can your browser, or a utility like `wget` to save these files in your
project folder.

```bash
wget https://cdn.jsdelivr.net/npm/vega@5.10.0 -O my_vega.js
wget https://cdn.jsdelivr.net/npm/vega-lite@4.8.1 -O my_vega_lite.js
wget https://cdn.jsdelivr.net/npm/vega-embed@6.5.1 -O my_vega_embed.js
```

The templates are text files similar to HTML files. We can create them using the
text editor, or a command like:

```bash
cat > .dvc/page_template  <<EOF
<html>
<head>
    <script src="my_vega.js" type="text/javascript"></script>
    <script src="my_vega_lite.js" type="text/javascript"></script>
    <script src="my_vega_embed.js" type="text/javascript"></script>
</head>
<body>
	{plot_divs}
</body>
</html>
EOF
```

In the template, the only difference from an HTML file is the `{plots_div}`
marker that identifies the place to put the plot. `<script>` tags in this HTML
file point to the local files we downloaded, instead of the web URLs.

Using `dvc plots` with the `--html-template .dvc/page_template` option tells DVC
to produce the visualization using the template we just created.

It's also possible to set the new template as default by `dvc config`:

`dvc config plots.html_template page_template`

The path given to `dvc config` is relative to the project's `.dvc` directory.

### Using a local HTTP server

Note that, if you don't want to store the downloaded JavaScript files within
your project directory, or have more than one project that you would like to
share the same JavaScript files, you can also use a local HTTP server.

Start a web server in the directory you store Vega JS files:

```bash
python -m http.server
```

Then you can modify the `<script>` tags in the template as:

```html
<script src="http://127.0.0.1:8000/my_vega.js"></script>
<script src="http://127.0.0.1:8000/my_vega_lite.js"></script>
<script src="http://127.0.0.1:8000/my_vega_embed.js"></script>
```
