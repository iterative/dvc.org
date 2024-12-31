# REST API

The purpose of the DVC Studio REST API is to give programmatic access to
information in DVC Studio and executing actions in it.

The API is hosted under the `/api` route on the DVC Studio server:

- https://studio.datachain.ai/api, or
- https://your-domain/api in case of
  [self-hosted DVC Studio](/doc/studio/self-hosting/installation).

To use the API, you need to generate [DVC Studio
tokens][DVC Studio client access token] with the necessary scopes.

The following APIs are available:

- [Create a new project](/doc/studio/rest-api/create-project)
- [Download model files](/doc/studio/rest-api/download-model)

[DVC Studio client access token]:
  /doc/studio/user-guide/account-management#client-access-tokens
