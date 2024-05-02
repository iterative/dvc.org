# SSL certificates

To enable HTTPS access to your self-hosted instance you need to copy your SSL
certificate to the `values.yaml` file for your DVC Studio instance.

Edit the `values.yaml` file as follows (note the indentation), copying the
certificate between the `-----BEGIN CERTIFICATE-----` and
`-----END CERTIFICATE-----` lines.

```yaml
global:
  customCaCerts:
    - |-
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
```

After that, run the following to apply the changes

```cli
helm upgrade studio iterative/studio --namespace studio -f values.yaml
```
