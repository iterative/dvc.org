# Sharing Resources

DVC enables different ways to optimize resource utilization for scenarios where
there is a desire or constraint to do so. Whether you have a single shared
server with multiple users, a single computing environment to run experiments,
need to share GPU access with others, or want a centralized data storage, it's
possible to setup DVC accordingly.

![](/img/shared-server.png) _Data store shared by DVC projects_

## Example: Shared Development Server

With DVC, you can easily setup shared data store on a server with multiple users
or processes. This enables near-instantaneous <abbr>workspace</abbr> restoration
and switching speeds for everyone – a **checkout for data**.

You and your colleagues can work in your own separate <abbr>workspaces</abbr> as
usual, and DVC will handle all your data in the most effective way possible.
Let's say you are cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc run -n clean_data -d cleanup.py -d raw -o clean \
          ./cleanup.py raw clean
# The data is cached in the shared location.
$ git add raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "cleanup raw data"
$ git push
```

Your colleagues can [checkout](/doc/command-reference/checkout) the
<abbr>project</abbr> data (from the shared <abbr>cache</abbr>), and have both
`raw` and `clean` data files appear in their workspace without moving anything
manually. After this, they could decide to continue building this
[pipeline](/doc/command-reference/dag) and process the clean data:

```dvc
$ git pull
$ dvc checkout
A       raw  # Data is linked from cache to workspace.
$ dvc run -n process_clean_data -d process.py -d clean -o processed
          ./process.py clean processed
$ git add dvc.yaml dvc.lock
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```
