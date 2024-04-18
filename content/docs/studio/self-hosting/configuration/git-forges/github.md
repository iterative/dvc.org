# GitHub integration

## Setting up the Github App

1. Go to **Organization settings** -> **Developer settings** -> **Github Apps**
   -> **New Github App**

   Fill out the details as follows, replacing
   [`localhost:8080`](http://localhost:8080) with your DVC Studio domain and
   port if applicable:

   ![](/img/studio-selfhosted-github-1.png)

   ![](/img/studio-selfhosted-github-2.png)

   ![](/img/studio-selfhosted-github-3.png)

   ![](/img/studio-selfhosted-github-4.png)

1. Under permissions, set the following:

   **Repository permissions:**

   - Contents: Read / Write
   - Issues: Read / Write
   - Metadata: Read
   - Pull Requests: Read / Write
   - Webhooks: Read / Write

   **User permissions:**

   - Email addresses: Read

1. Click **Create Github App**

1. Copy the **App ID** and **Client ID**

   Click **Generate a new client secret**, copy the output

   ![](/img/studio-selfhosted-github-5.png)

1. Scroll down to **Private keys**, click **Generate a private key**, copy the
   output

## Configuring DVC Studio with the GitHub App

Merge the `values.yaml` file with the following contents, replacing the strings marked with `<>` with the values the steps above:

```yaml
global:
  scmProviders:
    github:
      enabled: true

      # Set this if you're using the selfhosted version
      url: <GitHub Enterprise URL>
      # Set this if you're using the selfhosted version
      apiUrl: <GitHub Enterprise API URL>

      appName: <GitHub OAuth App Name>
      appId: <GitHub OAuth App ID>
      clientId: <GitHub OAuth App Client ID>
      clientSecret: <GitHub OAuth App Client Secret>
      privateKey: <GitHub OAuth App Private Key>

      # Optional
      # This is useful in cases where DVC Studio is on an internal
      # network, but the webhook endpoint is on an external network
      # webhookUrl: https://webhook.studio.company.com/webhook/github/
```
