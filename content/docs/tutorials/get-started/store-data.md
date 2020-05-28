# Store and Share Data

Now, that your data files are managed by DVC (see
[Add Files](/doc/tutorials/get-started/add-files)), you can push them from your
repository to the default [remote](/doc/command-reference/remote) storage\*:

```dvc
$ dvc push
```

The same way as with Git remote, it ensures that your data files and your models
are safely stored remotely and are shareable. This means that the data can be
pulled by yourself or your colleagues whenever you need it.

Usually, you run it along with `git commit` and `git push` to save the changed
[`.dvc` files](/doc/user-guide/dvc-file-format).

The `dvc push` command allows one to upload data to remote storage. It doesn't
save any changes in the code or `.dvc` files. Those should be saved by using
`git commit` and `git push`.

> \*As noted in the DVC [configuration](/doc/tutorials/get-started/configure)
> chapter, we are using a **local remote** in this section for illustrative
> purposes.

<details>

### Expand to learn more about DVC internals

You can check now that actual data file has been copied to the remote we created
in the [configuration](/doc/tutorials/get-started/configure) chapter:

```dvc
$ ls -R /tmp/dvc-storage
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

`a304afb96060aad90176268345e10355` above is the hash value of the `data.xml`
file. If you check the `data.xml.dvc`
[`.dvc` file](/doc/user-guide/dvc-file-format), you will see that it has this
string inside.

</details>
