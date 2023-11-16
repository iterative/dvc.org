## Upgrading DVC Studio (Regular procedure)

1. Connect to the instance with SSH

2. Update the Helm repository

```cli
$ helm repo update
```

3. Upgrade DVC Studio to the latest version

```cli
$ helm upgrade --atomic studio iterative/studio --namespace studio --values values.yaml
```

<admon type="info">

`values.yaml` refers to your configuration file. In case you've named it
differently, please update the file name in the command accordingly.

</admon>

Once the upgrade succeds, you should see output such as this:

```
Release "studio" has been upgraded. Happy Helming!
NAME: studio
LAST DEPLOYED: Tue Oct 17 17:51:53 2023
NAMESPACE: studio
STATUS: deployed
REVISION: 5
NOTES:
Application URL:
  http://192.168.1.1/
```
