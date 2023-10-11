# AWS AMI Installation

## Prerequisites

### Studio Images

The Studio machine image (AMI) and access to the Studio Docker images need to be
provided by the Iterative team to enable the installation.

### DNS

Create a DNS record pointing to the IP address of the EC2 instance. This
hostname will be used for Studio.

## Installation

1. Open the AWS Console

2. Navigate to EC2 -> Instances

3. Click **Launch instances**

4. Provide a name for your EC2 instance

![](/img/studio-selfhosted-ami-1.png)

5. Select **studio-selfhosted** from the AMI catalog (owner: 260760892802)

![](/img/studio-selfhosted-ami-2.png)

6. Select an appropriate instance type.

   - Minimum requirements: 16 GB RAM, 4 vCPUs
   - Recommended requirements: 32 GB RAM, 8 vCPUs

![](/img/studio-selfhosted-ami-3.png)

7. To enable SSH connections to the instance, select an existing key pair to use
   or create an existing one. We recommend ED25519 keys.

![](/img/studio-selfhosted-ami-4.png) ![](/img/studio-selfhosted-ami-5.png)

8. In the network settings, use either the default VPC or change it to a desired
   one. Under the Firewall setting, create a new security group with SSH, HTTP,
   and HTTPS access or use an existing one with the same level of access.

![](/img/studio-selfhosted-ami-6.png)

<admon type="warn">

It's important to ensure that your VPC has connectivity to your Git forge
(Github, Gitlab, or Bitbucket)

</admon>

9. Configure the storage. We recommend a minimum of 50 GB block storage.

![](/img/studio-selfhosted-ami-7.png)

10. Launch the EC2 instance

![](/img/studio-selfhosted-ami-8.png)

11. Wait for the EC2 instance to become available. Next, copy its IP address.

12. Open a terminal, and run the following commands to connect to the instance:

```cli
$ ssh -i <EC2 key pair> ubuntu@$EC2_INSTANCE
```

<admon type="info">

The commands in the upcoming steps (13-15) are all meant to be run over SSH on
the EC2 instance.

</admon>

13. Configure the Docker registry credentials:

```cli
ubuntu@ami:~$ kubectl create secret docker-registry iterativeai \
  --namespace studio \
  --docker-server=docker.iterative.ai \
  --docker-username=<username> \
  --docker-password=<password>
```

<admon type="info">

Replace the strings marked with `< >`

The `DOCKER_USERNAME` and `DOCKER_PASSWORD` will be provided to you by our
support team in preparation for the installation.

</admon>

13. Update the Helm repository using the following command:

```cli
ubuntu@ami:~$ helm repo update
```

<admon type="info">

Replace the strings marked with `< >`

</admon>

14. Create a new `values.yaml` file with the appropriate configuration. See the
    [configuration section](/doc/studio/self-hosting/configuration) for more
    details. Example config with a custom Gitlab instance:

```yaml
imagePullSecrets:
  - name: iterativeai

global:
  host: <Studio hostname>
  scmProviders:
    gitlab:
      enabled: true
      url: '<GitLab URL>'
      clientId: '<GitLab OAuth App Client ID>'
      secretKey: '<GitLab OAuth App Secret Key>'
      webhookSecret: '<GitLab Webhook Secret>'
```

<admon type="info">

Replace the strings marked with `< >`

</admon>

15. To install the Studio application using Helm, run the following command:

```cli
ubuntu@ami:~$ helm install --wait studio iterative/studio --namespace studio -f values.yaml
```

16. You're done! Access DVC Studio by opening the configured hostname in your
    browser

![](/img/studio-selfhosted-ami-9.png)
