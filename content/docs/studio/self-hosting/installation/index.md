## Self-hosting Studio

Studio Enterprise users can host DVC Studio on their own infrastructure
(on-premises) or in their cloud accounts.

Please note that our support is needed to make the Studio's cloud/Docker images
available to you to enable installation. Please get in touch with our
[sales team](https://calendly.com/gtm-2/studio-overview?month=2023-03) to
coordinate a meeting.

Below are the supported installation methods:

- [AMI (AWS)](/doc/studio/self-hosting/installation/aws-ami)
- [Kubernetes (Helm)](/doc/studio/self-hosting/installation/k8s-helm)

## System requirements

<toggle>
<tab title="VM (AMI)">

Recommended requirements:

- 32 GB RAM
- 4 vCPUs
- 100 GB disk space

</tab>
<tab title="Helm">

We recommend deploying Studio in an auto-scaling node group with a minimum of 2
nodes.

Each node should have at least 16 GB of RAM and 4 vCPUs.

Additionally, you'll need 100 GB of block storage for Studio's
`PersistentVolume`

</tab>
</toggle>

## Studio's architecture

![](/img/studio-architecture-diagram.svg)

Studio is composed of four pieces:

- Frontend Server: Renders the web interface
- Backend Server: Stores all user information
- Celery Beat: Coordinates background tasks
- Celery Worker: Processes background tasks
