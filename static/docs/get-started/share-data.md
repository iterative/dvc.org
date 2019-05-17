# Share Data

Now, that your data files are managed by DVC (see
[Add Files](/doc/get-started/add-files)), you can push them from your repository
to the default [remote](/doc/commands-reference/remote) storage\*:

```dvc
$ dvc push
```

The same way as with Git remote, it ensures that your data files and your models
are safely stored remotely and are shareable. It means that this data could be
pulled by your team or you when you need it.

Usually, you run it along with `git commit` and `git push` to save changes to
`.dvc` files to Git.

See `dvc push` for more details and options for this command.

> \*As noted in the DVC [configuration](/doc/get-started/configure) chapter, we
> are using a **local remote** in this guide for educational purposes.

<details>

### Expand to learn more about DVC internals

You can check now that actual data file has been copied to the remote we created
in the [configuration](/doc/get-started/configure) chapter:

```dvc
$ ls -R /tmp/dvc-storage
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

where `a304afb96060aad90176268345e10355` is an MD5 hash of the `data.xml` file,
and if you check the `data.xml.dvc` meta-file you will see that it has this hash
inside.

</details>
