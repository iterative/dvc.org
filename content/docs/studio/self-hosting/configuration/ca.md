# CA certificates

Does your Git forge use a certificate signed by a custom certificate authority
(CA)? If so, Studio needs to have the CA certificate in order to connect to the
Git forge.

To do this, copy your CA certificate as plain text, then insert it in the
`customCaCert` key in the `values.yaml` configuration file:

```yaml
global:
  customCaCert: |-
    -----BEGIN CERTIFICATE-----
    ....
    -----END CERTIFICATE-----
```
