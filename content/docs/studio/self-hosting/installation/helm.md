# Installing Studio Self-hosted via Helm

## Prerequisites

**Software**

You can deploy Studio Self-hosted on any Kubernetes cluster (version => 1.20)
that has an ingress controller configured and installed.

The choice of ingress controller is up to you. We have good experiences with
[ingress-nginx](https://kubernetes.github.io/ingress-nginx/) but Studio will
work on other ingress controllers as well.

You'll also need to have the following CLI tools configured and installed:

- Helm
- Kubectl

**DNS**

Create the following two DNS records pointing to the IP address of your load
balancer:

- `studio.company.com`
- `minio.studio.company.com`

## 1. Create a namespace

We'll install Studio and related components in a dedicated `studio` namespace.
Let's create it now:

```cli
$ kubectl create namespace studio
```

<admon type="tip">

If you want to install Studio in any other namespace, modify the --namespace
flag in the following commands accordingly

</admon>

## 2. Create a Docker registry secret

Configure Docker credentials for pulling images from our private registry:

```cli
$ kubectl create secret docker-registry iterativeai \
    --namespace studio \
    --docker-server=docker.iterative.ai \
    --docker-username=<username> \
    --docker-password=<password>
```

Replace `<username>` and `<password>` with the credentials you've received.

## 3. Add the Iterative Helm repository

```cli
$ helm repo add iterative https://helm.iterative.ai
```

## 3. Install Studio

In this example, we'll configure Studio to integrate with GitLab and use the
built in Postgres, Redis, and Minio.

<admon info="tip">

For a comprehensive list on Studio's configuration options, please see the
Configuration section in the sidebar.

</admon>

Let's start by creating a YAML configuration file, `values.yaml`, with the
following contents:

```yaml
imagePullSecrets:
  - name: iterativeai

global:
  host: 'studio.company.com'
  ingress:
    enabled: true
  scmProviders:
    gitlab:
      enabled: true
      appId: '<app-id>'
      appName: '<app-name>'
      clientId: '<gh-client-id>'
      clientSecret: '<gh-app-secret>'

minio:
  apiIngress:
    enabled: true
    hostname: minio.studio.company.com
```

Now let's deploy Studio with the command:

```cli
$ helm install studio iterative/studio \
    --namespace studio \
    -f values.yaml
```

🎉 You can now access Studio in your browser on the domain that you've
configured.