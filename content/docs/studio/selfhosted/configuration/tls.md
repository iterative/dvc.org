# TLS certificates

We strongly recommend deploying Studio with a TLS certificate.

## Configuring up the TLS certificate and private key

To configure TLS certificates to Studio, following the instructions below
according to your installation method:

<toggle>
<tab title="AMI">

1. Transfer your TLS certificate and private key to the EC2 instance

```shell
$ scp studio.crt studio.pem ubuntu@my-ec2-instance:.
```

2. Connect with SSH to your EC2 instance

```shell
$ ssh ubuntu@my-ec2-instance
```

3. Store your TLS certificate and private key in an object

```shell
$ kubectl create secret tls studio-ingress-tls \
      --namespace studio \
      --cert=studio.crt \
      --key=studio.pem
```

4. Update Studio's config file

Merge your `values.yaml` file with the following contents:

```yaml
global:
  ingress:
    tlsEnabled: true
    tlsSecretName: studio-ingress-tls
```

5. Redeploy Studio

```shell
$ helm upgrade --wait studio iterative/studio --namespace studio -f values.yaml
```

</tab>

<tab title="Helm">

1. Store your TLS certificate and private key in an object

```shell
$ kubectl create secret tls studio-ingress-tls \
      --namespace studio \
      --cert=studio.crt \
      --key=studio.pem
```

2. Update Studio's config file

Merge your `values.yaml` file with the following contents:

```yaml
global:
  ingress:
    tlsEnabled: true
    tlsSecretName: studio-ingress-tls
```

3. Redeploy Studio

```shell
$ helm upgrade --wait studio iterative/studio --namespace studio -f values.yaml
```

</tab>

</toggle>
