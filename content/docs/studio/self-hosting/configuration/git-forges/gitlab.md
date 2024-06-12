# GitLab integration

## Creating the GitLab Application

1. Go to **Admin Area** -> **Applications** -> **Applications** -> **New**
   **application** Fill out the details as follows

![](/img/studio-selfhosted-gitlab-1.png)

2. Replace [`localhost:8080`](http://localhost:8080) with your DVC Studio domain
   and port if applicable.
3. Click **Save application**
4. Copy the **Application ID** and **Secret**

![](/img/studio-selfhosted-gitlab-2.png)

## Creating the webhook

The webhooks are created automatically per repository. To check if the webhook
got created:

1. Go to repository **Settings -> Webhooks**
2. Scroll down to see **Project Hooks**
3. Check if there is a hook pointing to your DVC Studio instance:

![](/img/studio-selfhosted-gitlab-3.png)

## Configuring DVC Studio with the GitLab App

Merge the `values.yaml` file with the following contents:

```yaml
global:
  scmProviders:
    # Optional
    # This is useful in cases where DVC Studio is on an internal
    # network, but the webhook endpoint is on an external network.
    # Default: `global.host` value.
    #webhookHost: ""
    gitlab:
      enabled: true

      # Set this if you're hosting GitLab on a
      # custom domain
      url: <GitLab URL>

      clientId: <GitLab OAuth App Client ID>
      secretKey: <GitLab OAuth App Secret Key>
      webhookSecret: <GitLab Webhook Secret>
```

<admon type="info">

Replace the strings marked with `< >`

</admon>

## Troubleshooting

### GitLab Webhook didn’t get created

If there is no webhook in the repository, it is likely due to the GitLab
instance settings.

By default, GitLab blocks webhook requests to local networks. To fix this, you
need to whitelist your domain in GitLab:

1. Open **Admin Area** in GitLab
2. Go to **Settings -> Network**

![](/img/studio-selfhosted-gitlab-4.png)

1. Expand the **Outbound requests** panel

![](/img/studio-selfhosted-gitlab-5.png)

2. Select the checkbox: **Allow requests to the local network from system
   hooks**
3. In the textbox, **Local IP addresses and domain names that hooks and services
   may access,** either write:

   - your studio domain, e.g. **studio.example.com**
   - IP network range, e.g. **10.0.0.0/16**

   So if DVC Studio is configured with
   [https://studio.example.com](https://studio.example.com), write:

   ```bash
   studio.example.com
   ```

More examples of using the allowlist can be found in GitLab’s documentation:
[Create an allowlist for local requests](https://docs.gitlab.com/ee/security/webhooks.html#create-an-allowlist-for-local-requests)
