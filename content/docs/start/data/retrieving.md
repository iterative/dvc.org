## Retrieving

Having DVC-tracked data and models stored remotely, it can be downloaded when
needed in other copies of this <abbr>project</abbr> with `dvc pull`. Usually, we
run it after `git clone` and `git pull`.

<details>

### ⚙️ Expand to delete locally cached data.

If you've run `dvc push`, you can delete the cache (`.dvc/cache`) and
`data/data.xml` to experiment with `dvc pull`:

<toggle>
<tab title="Mac/Linux">

```dvc
$ rm -rf .dvc/cache
$ rm -f data/data.xml
```

</tab>
<tab title="Windows (Cmd)">

```dvc
$ rmdir .dvc\cache
$ del data\data.xml
```

</tab>
</toggle>

</details>

```dvc
$ dvc pull
```

> 📖 See `dvc remote` for more information on remote storage.
