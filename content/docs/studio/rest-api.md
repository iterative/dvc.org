# REST API

The purpose of the DVC Studio REST API is to give programmatic access to
information in DVC Studio and executing actions in it.

The API is hosted under the `/api` route on the DVC Studio server:
https://studio.iterative.ai/api or https://your-domain/api in case of
[self-hosted DVC Studio](/doc/studio/self-hosting/installation).

To use API, you need to generate [DVC Studio tokens] with the necessary scopes.

## Download model

Get signed URL to download the model binaries for a model from the <abbr>model
registry</abbr>. Requires the model to be stored with DVC with a S3, Azure, http
or https [remote]. Note, that you need to
[set up remote cloud credentials](/doc/studio/user-guide/account-and-billing#cloud-credentials)
for DVC Studio to have rights to the signed URLs. The signed URLs expire after
one hour.

```yaml
Endpoint: api/model-registry/get-download-uris
HTTP Method: GET
```

### Request

| param   | desc          | type   | required | example value                      |
| ------- | ------------- | ------ | -------- | ---------------------------------- |
| repo    | Git repo URL  | string | true     | iterative/demo-bank-customer-churn |
| name    | Model name    | string | true     | randomforest-model                 |
| version | Model version | string | false    | v2.0.0                             |
| stage   | Model stage   | string | false    | prod                               |

Only one of stage or version is allowed. If no version or stage is specified,
the latest version is returned.

When your model is annotated in non-root [`dvc.yaml`] file (typical for monorepo
case), model name will be constructed from two parts separated by colon:
`path/to/dvc/yaml:model_name`.

| header        | desc            | example value |
| ------------- | --------------- | ------------- |
| Authorization | Header for auth | token abc123  |

### Response

Response is a JSON-encoded dict. If the request was successful, keys will be
paths to files inside the repo, and values will be signed URLs you can query to
actually download the model.

### Example

First, you need your [DVC Studio client access token] with Model Registry scope.
For this example, we set it in the `DVC_STUDIO_TOKEN` environment variable:

```sh
export DVC_STUDIO_TOKEN=<TOKEN>
```

<toggle>

<tab title="Python">

```python
import json
import os
import requests


url = "https://studio.iterative.ai/api/model-registry/get-download-uris"
token = os.environ["DVC_STUDIO_TOKEN"]
headers = {"Authorization": f"token {token}"}
params = {
    "repo": "git@github.com:iterative/demo-bank-customer-churn.git",
    "name": "randomforest-model",
    "version": "v2.0.0"
}

response = requests.get(url, headers=headers, params=params)
for rel_path, obj_url in json.loads(response.content).items():
    obj = requests.get(obj_url)
    ...
```

</tab>

<tab title="CLI">

```sh
$ curl "https://studio.iterative.ai/api/model-registry/get-download-uris?repo=git@github.com:iterative/demo-bank-customer-churn.git&name=randomforest-model&version=v2.0.0" --header "Authorization:token ${DVC_STUDIO_TOKEN}"

{
    ".mlem/model/clf-model": "https://sandbox-datasets-iterative.s3.amazonaws.com/bank-customer-churn/86/bd02376ac675568ba2fac566169ef9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU7UXIWDIQFPCO76Q%2F20230706%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230706T134619Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6807259ddd1f4448ed1e3c5d4503039884f7779381ee556175096b0a884ba1a6"
}
```

</tab>

<admon type="warn">

Running this example will fail because it requires that you have [set up remote
cloud credentials] in DVC Studio to where the model is stored.

</admon>
</toggle>

## Create new project

To create a new project programmatically, you can integrate with the DVC Studio
API. The API provides a POST request endpoint for creating projects.
Authentication is required using a token, which can be generated from the user's
profile settings in DVC Studio

```yaml
Endpoint: api/create-project
HTTP Method: POST
Content-Type: application/json
```

### Request

Here are the possible values for each parameter in the request json:

- `repo_url` (required): The URL of the repository where the project will be
  created. This field is mandatory.
- `public` (boolean, default: false): Specifies whether the project should be
  public (`true`) or not (`false`).
- `team_name`(string, default: none): The name of the team associated with the
  project if we want to create the project in team space. This field is
  optional. If team name is not specified, the project will be in user
  namespace.
- `subdir`(string, default: none): The subdirectory within the repository where
  the project will be located, in case of a monorepo. This field is optional.
- `name` (string, default: none): The name of the project to be defined. If no
  name is specified, it will be extracted from repository name. This field is
  optional.

| header        | desc            | example value |
| ------------- | --------------- | ------------- |
| Authorization | Header for auth | token abc123  |

Accepted formats for repository urls are:

- `git@github.com:amritghimire/example-dvc-experiments.git`
- `https://github.com/nimdraugsael/example-dvc-experiments.git`
- `https://gitlab.example.org/amritghimire/example.git` (For custom gitlab)
- `ssh://git@gitlab.com/xxx/yyy/zzz/repo.git`

Similar format is supported for Github, Bitbucket and Gitlab.

### Response

Here is an example JSON response from the API request:

```json
{
  "projects": [
    {
      "id": "tsanhawn9y",
      "url": "https://studio.iterative.ai/user/amritghimire/projects/example-get-started-tsanhawn9y",
      "name": "example-get-started"
    }
  ]
}
```

This response confirms that the project was successfully created and provides
the necessary information about the created project:

- `id`: The unique identifier of the project. In this case, the project ID is
  "tsanhawn9y".
- `url`: The URL of the created project. You can access the project using this
  URL. In this example, the project URL is
  `https://studio.iterative.ai/user/amritghimire/projects/example-get-started-tsanhawn9y`.
- `name`: The name of the created project. In this example, the project name is
  "example-get-started".

This information can be used to access and reference the project in the future.

### Example

First, you need your [DVC Studio access token]. For this example, we set it in
the `DVC_STUDIO_TOKEN` environment variable:

```sh
export DVC_STUDIO_TOKEN=<TOKEN>
```

<toggle>

<tab title="Python">

```python
import json
import os
import requests


url = "https://studio.iterative.ai/api/create-project"
token = os.environ["DVC_STUDIO_TOKEN"]
payload = json.dumps({
  "repo_url": "https://github.com/amritghimire/monorepo-model-registry-fixture",
  "public": True,
  "team_name": "team_name",
  "subdir": "nested",
  "name": "test-nested"
})
headers = {
  'Authorization': f'token {token}',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
for project in response.json()["projects"]:
    print(project["url"])
    ...
```

</tab>

<tab title="CLI">

```sh
$ curl --location 'https://studio.iterative.ai/api/create-project' \
--header "Authorization:token ${DVC_STUDIO_TOKEN}" \
--header 'Content-Type: application/json' \
--data '{
    "repo_url": "https://github.com/organization/repo",
    "public": true,
    "team_name": "team",
    "subdir": "nested",
    "name": "test-nested"
}'
```

</tab>
</toggle>

<aside>
💡 If you are interacting with Self hosted Studio, remember to replace the URL https://studio.iterative.ai with the URL of the self-hosted studio.
</aside>

[remote]: /doc/user-guide/data-management/remote-storage
[`dvc.yaml`]: /doc/user-guide/project-structure/dvcyaml-files
[DVC Studio client access token]:
  /doc/studio/user-guide/account-and-billing#client-access-tokens
[set up remote cloud credentials]:
  /doc/studio/user-guide/account-and-billing#cloud-credentials
