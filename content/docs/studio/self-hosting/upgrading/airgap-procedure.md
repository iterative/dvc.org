## Upgrading DVC Studio (Air-gapped)

<admon type="warn">

These upgrade procedures are only applicable if you've deployed DVC Studio in a
VM on an air-gapped machine.

</admon>

First, we'll start by downloading the latest Helm chart and the latest Docker
images from a machine with internet access.

1. Downloading the Helm chart

```cli
$ helm repo update
$ helm pull iterative/studio
```

Then, let's get the filename:

```cli
$ ls -l studio-*.tgz
-rw-r--r--. 1 username username 392409 Oct 11 14:30 studio-0.7.0.tgz
```

Now, we'll retrieve the DVC Studio application version embedded in the Helm
chart. Use the filename from before in the following command:

```cli
$ export STUDIO_VERSION=$(tar zxf studio-0.7.0.tgz -O studio/Chart.yaml | grep -Po '(?<=appVersion: )v[\d.]+')
```

2. Downloading the Docker images

Authenticate to the Docker registry with your personal credentials and download
the Docker images:

```cli
$ docker login docker.iterative.ai
```

```cli
$ docker pull docker.iterative.ai/studio-frontend:$STUDIO_VERSION
$ docker save docker.iterative.ai/studio-frontend:$STUDIO_VERSION > studio-frontend-$STUDIO_VERSION.tar

$ docker pull docker.iterative.ai/studio-backend:$STUDIO_VERSION
$ docker save docker.iterative.ai/studio-backend:$STUDIO_VERSION > studio-backend-$STUDIO_VERSION.tar

$ docker pull docker.iterative.ai/studio-dvcx-worker:$STUDIO_VERSION
$ docker save docker.iterative.ai/studio-dvcx-worker:$STUDIO_VERSION > studio-dvcx-worker-$STUDIO_VERSION.tar
```

3. Transfer the Helm chart and Docker images to the instance

The procedure on transferring the the Helm chart and Docker images to the
instance will vary for each user, thus we can't provide any examples. However,
any method that you deem acceptable will do.

4. Loading the Docker images into the container runtime

```cli
$ docker load -i studio-frontend-$STUDIO_VERSION.tar
$ docker load -i studio-backend-$STUDIO_VERSION.tar
$ docker load -i studio-dvcx-worker-$STUDIO_VERSION.tar
```

5. Upgrading DVC Studio

We'll start by extracting the archive containing the Helm chart:

```cli
$ tar zxvf studio-0.7.0.tgz
```

Finally, we'll execute the upgrade:

```cli
$ helm upgrade --atomic studio studio --namespace studio --values values.yaml
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
