# Configuration

Studio has a unified YAML configuration file, often referred to as `values.yaml`
in the documentation.

## Updating the configuration

To update the configuration and reload Studio, follow the instructions according
to your installation method:

<toggle>
<tab title="AMI">

1. Connect with SSH to your EC2 instance

```cli
$ ssh ubuntu@my-ec2-instance
```

2. Update Studio's `values.yaml` config file

**Example: Updating the hostname**

Merge the existing `values.yaml` file with the following contents:

```yaml
global:
  host: studio.company2.com
```

3. Reload Studio

```cli
$ helm upgrade --wait studio iterative/studio --namespace studio -f values.yaml
```

</tab>

<tab title="Helm">

1. Update Studio's `values.yaml` config file

**Example: Updating the hostname**

Merge the existing `values.yaml` file with the following contents:

```yaml
global:
  host: studio.company2.com
```

2. Reload Studio

```cli
$ helm upgrade --wait studio iterative/studio --namespace studio -f values.yaml
```

</tab>

</toggle>

## More configuration options

The previous chapter provided a basic example of updating the Studio
configuration. In most cases, you'll likely need to do more configuration to set
up Studio to your needs.

Studio integrates with several Git forges, each of which are configured
differently:

- [GitHub](/doc/studio/selfhosted/configuration/github)
- [GitLab](/doc/studio/selfhosted/configuration/gitlab)

Additionally, you may want be interested in the following:

- [TLS certificates](/doc/studio/selfhosted/configuration/tls)
