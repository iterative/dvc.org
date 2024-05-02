# TLS certificates

We strongly recommend deploying DVC Studio with a TLS certificate.

## Configuring up the TLS certificate and private key

To configure TLS certificates to DVC Studio, following the instructions below
according to your installation method:

<admon type="info">

If you've deployed DVC Studio with the AMI, you'll need to copy your TLS
certificate and private key to the EC2 instance and start an SSH session before
continuing. Example:

1. Transfer your TLS certificate and private key to the EC2 instance

```cli
$ scp studio.crt studio.pem ubuntu@my-ec2-instance:.
```

2. Connect with SSH to your EC2 instance

```cli
$ ssh ubuntu@my-ec2-instance
```

</admon>

1. Store your TLS certificate and private key in an object

```cli
$ kubectl create secret tls studio-ingress-tls \
      --namespace studio \
      --cert=studio.crt \
      --key=studio.pem
```

2. Update DVC Studio's config file

Merge the `values.yaml` file with the following contents:

```yaml
global:
  ingress:
    tlsEnabled: true
    tlsSecretName: studio-ingress-tls
```

3. Reload DVC Studio

```cli
$ helm upgrade --wait studio iterative/studio --namespace studio -f values.yaml
```
