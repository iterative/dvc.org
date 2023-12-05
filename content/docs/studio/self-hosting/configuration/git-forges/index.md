# Git Forges

DVC Studio integrates with several Git forges (also referred to as SCM
providers), each of which are configured differently. For any Git forge type
you'll need to configure an app prior to DVC Studio installation, and also
configure a dedicated block under `scmProviders` in the `values.yaml` file:

- [GitHub](/doc/studio/self-hosting/configuration/git-forges/github)
- [GitLab](/doc/studio/self-hosting/configuration/git-forges/gitlab)
- [Bitbucket](/doc/studio/self-hosting/configuration/git-forges/bitbucket)

<admon type="tip">

If your Git forge uses a certificate signed by a custom certificate authority,
see [CA certificates](/doc/studio/self-hosting/configuration/ca)

</admon>
