# CA certificates

Do you use a custom certificate for DVC Studio or one of your Git forges? If so,
DVC Studio needs to have the CA certificates in order to establish connections.

To do this, copy your CA certificates as plain text, then add them to the
`customCaCerts` list in the `values.yaml` configuration file:

```yaml
global:
  customCaCerts:
    # First certificate
    - |-
      -----BEGIN CERTIFICATE-----
      ....
      -----END CERTIFICATE-----
    # Second certificate
    - |-
      -----BEGIN CERTIFICATE-----
      ....
      -----END CERTIFICATE-----
```
