# Installing Studio Self-hosted via the AMI

1. Open the AWS Console

2. Navigate to EC2 -> Instances

3. Click **Launch instances**

4. Provide a name for your EC2 instance

![](/img/studio-selfhosted-ami-1.png)

5. Select **studio-selfhosted** from the AMI catalog (owner: 260760892802)

![](/img/studio-selfhosted-ami-2.png)

6. Select an appropriate instance type. The minimum requirements are 16 GB RAM
   and four vCPUs, and the recommended requirements are 32 GB RAM and eight
   vCPUs. In this example, we’ll choose the `m6i.2xlarge` type:

![](/img/studio-selfhosted-ami-3.png)

7. Select an existing key pair to use or create an existing one. We recommend
   ED25519 keys.

![](/img/studio-selfhosted-ami-4.png) ![](/img/studio-selfhosted-ami-5.png)

8. In network settings, use the default VPC or change it to a desired one. Under
   the Firewall setting, create a new security group with SSH, HTTP, and HTTPS
   access or use an existing one with the same level of access.

![](/img/studio-selfhosted-ami-6.png)

<admon type="warn">

Please ensure that your VPC has connectivity to your SCM provider (Github,
Gitlab, or Bitbucket)

</admon>

9. Configure the storage. We recommend a minimum of 50 GB block storage.

![](/img/studio-selfhosted-ami-7.png)

10. Launch the EC2 instance

![](/img/studio-selfhosted-ami-8.png)

11. Wait for the EC2 instance to become available. Now, copy its IP address.

12. Open a terminal, and run the following commands:

```cli
$ export DOCKER_USERNAME=<Docker registry username>
$ export DOCKER_PASSWORD=<Docker registry password>
$ export EC2_INSTANCE=<EC2 instance hostname>

$ ssh -i studio.pem ubuntu@$EC2_INSTANCE "kubectl create secret docker-registry iterativeai --namespace studio --docker-server=docker.iterative.ai --docker-username=$DOCKER_USERNAME --docker-password=$DOCKER_PASSWORD"
```

<admon type="info">

Replace the strings marked with < >

</admon>

13. Update the Helm repository using the following command:

```cli
$ helm repo update
```

14. Create a new file values.yaml with the following contents:

```yaml
imagePullSecrets:
  - name: iterativeai

global:
  host: <EC2 instance hostname>
  sessionCookieSecure: false # if not running on HTTPS
  ingress:
    enabled: true

  scmProviders:
    enableWebhookSSL: true
    gitlab:
      # -- GitLab enabled
      enabled: true
      # -- GitLab URL
      url: '<GitLab URL>'
      # -- GitLab OAuth App Client ID
      clientId: '<GitLab OAuth App Client ID>'
      # -- GitLab OAuth App Secret Key
      secretKey: '<GitLab OAuth App Secret Key>'
      # -- GitLab Webhook URL
      webhookUrl: '<GitLab Webhook URL>'
      # -- GitLab Webhook Secret
      webhookSecret: '<GitLab Webhook Secret>'

  customCaCert: |-
    <raw CA certificate of GitLab certificate>
```

<admon type="info">

Replace the strings marked with < >

</admon>

15. Open a terminal, and run the following command:

```cli
$ helm repo update
```

16. Confirm that all Studio components show `Running` in the status

```cli
ssh -i studio.pem ubuntu@$EC2_INSTANCE kubectl get pod -n studio
NAME                             READY   STATUS    RESTARTS   AGE
studio-minio-847ff9757c-nbdc9    1/1     Running   0          1m
studio-redis-master-0            1/1     Running   0          1m
studio-redis-replicas-0          1/1     Running   0          1m
studio-postgresql-0              1/1     Running   0          1m
studio-redis-replicas-1          1/1     Running   0          1m
studio-redis-replicas-2          1/1     Running   0          1m
studio-beat-74d8b56bd8-8m928     1/1     Running   0          1m
studio-worker-65f49f9854-2rbpv   1/1     Running   0          1m
studio-backend-858cd8d7f-nx725   1/1     Running   0          1m
studio-ui-c8b9c768d-rl6fw        1/1     Running   0          1m
```

<admon type="warn">

Ensure none of the components have ImagePullBackOff / ErrImagePull in the
status. If so, please go to Troubleshooting

</admon>

17. Access Iterative Studio by opening the EC2 hostname in your browser

![](/img/studio-selfhosted-ami-9.png)
