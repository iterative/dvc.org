## Upgrading Studio (Regular procedure)

1. Connect to the instance with SSH

2. Update the Helm repository

```cli
$ helm repo update
```

3. Upgrade Studio to the latest version

```cli
$ helm upgrade --atomic studio iterative/studio --namespace studio -f values.yaml
```

<admon type="info">

`values.yaml` refers to your configuration file. In case you've named it
differently, please update the file name in the command accordingly.

</admon>

Once the upgrade succeds, you should see output such as this:

![](/img/studio-selfhosted-successful-upgrade.png)
