# Configuration

Studio uses a standardized, unified YAML configuration file, often referred to
as `values.yaml` in the documentation.

## Updating the configuration

To update the configuration and apply the changes, follow the instructions
below:

<admon type="info">

If you've deployed Studio with the AMI, you'll need to SSH to the EC2 instance
before continuing.

</admon>

1. Update Studio's `values.yaml` config file

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

## More configuration options

The previous chapter provided a basic example of updating the Studio
configuration. In most cases, you'll likely need to do more configuration to set
up Studio to your needs.

Studio integrates with several Git forges (also referred to as SCM providers),
each of which are configured differently:

- [GitHub](/doc/studio/selfhosted/configuration/github)
- [GitLab](/doc/studio/selfhosted/configuration/gitlab)

To allow secure access to Studio, we highly recommend setting up a valid TLS
certificate. To set this up, check out the
[TLS certificates](/doc/studio/selfhosted/configuration/tls) page.
