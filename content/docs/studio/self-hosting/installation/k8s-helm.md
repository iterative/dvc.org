# K8s Installation using Helm

## Prerequisites

### DVC Studio Images

Access to the DVC Studio Docker images need to be provided by the Iterative team
to enable the installation.

### Software

You can deploy DVC Studio Self-hosted on any Kubernetes cluster (version =>
1.20) that has an ingress controller configured and installed.

The choice of ingress controller is up to you. We recommend the
[ingress-nginx](https://kubernetes.github.io/ingress-nginx/) controller, but DVC
Studio will work on other ingress controllers as well.

You'll also need to have the following CLI tools configured and installed:

- Helm
- Kubectl

### DNS

Create a DNS record pointing to the external IP address of your ingress
controller. This hostname will be used for DVC Studio.

## 1. Create a namespace

We'll install DVC Studio and related components in a dedicated `studio`
namespace. Let's create it now:

```cli
$ kubectl create namespace studio
```

<admon type="tip">

If you want to install DVC Studio in any other namespace, modify the
`--namespace` flag in the following commands accordingly

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

## 3. Install the DVC Studio Helm chart

In this example, we'll configure DVC Studio to integrate with GitLab and use the
built in Postgres, Redis, and Minio.

<admon info="tip">

For a comprehensive list on DVC Studio's configuration options, please see the
Configuration section in the sidebar.

</admon>

Let's start by creating a YAML configuration file, `values.yaml`, with the
following contents:

```yaml
imagePullSecrets:
  - name: iterativeai

global:
  host: '<DVC Studio hostname>'
  scmProviders:
    gitlab:
      enabled: true
      url: '<GitLab URL>'
      clientId: '<GitLab OAuth App Client ID>'
      secretKey: '<GitLab OAuth App Secret Key>'
      webhookSecret: '<GitLab Webhook Secret>'
```

Now let's deploy DVC Studio with the command:

```cli
$ helm install studio iterative/studio \
    --namespace studio \
    -f values.yaml
```

🎉 You can now access DVC Studio in your browser on the domain that you've
configured.
