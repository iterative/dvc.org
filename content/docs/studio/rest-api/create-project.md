# Create a new project

To create a new project programmatically, you can use with the DVC Studio API.
The API provides a POST request endpoint for creating projects. Authentication
is required using a token, which can be generated from the user's profile
settings in DVC Studio

```yaml
Endpoint: api/create-project
HTTP Method: POST
Content-Type: application/json
```

## Request

Here are the possible values for each parameter in the request json:

- `repo_url` (required) - the URL of the repository where the project will be
  created. This field is mandatory.
- `public` (boolean, default: `false`) - specifies whether the project should be
  public (`true`) or not (`false`).
- `team_name`(string) - the name of the team associated with the project if we
  want to create the project in team space. This field is optional. If team name
  is not specified, the project will be in user namespace.
- `subdir`(string) - the subdirectory within the repository where the project
  will be located, in case of a monorepo. This field is optional.
- `name` (string) - the name of the project to be defined. If no name is
  specified, it will be extracted from repository name. This field is optional.

The request should contain following header for authorization.

| header        | desc            | example value |
| ------------- | --------------- | ------------- |
| Authorization | Header for auth | token abc123  |

Accepted formats for `repo_url` are:

- `git@github.com:amritghimire/example-dvc-experiments.git`
- `https://github.com/nimdraugsael/example-dvc-experiments.git`
- `https://gitlab.example.org/amritghimire/example.git` (For custom gitlab)
- `ssh://git@gitlab.com/xxx/yyy/zzz/repo.git`

Similar format is supported for Github, Bitbucket and Gitlab.

## Response

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

## Example

First, you need your [DVC Studio client access token] . For this example, we set
it in the `DVC_STUDIO_TOKEN` environment variable:

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

<admon type="tip">
  If you are interacting with Self hosted Studio, remember to replace the URL
  https://studio.iterative.ai with the URL of the self-hosted studio.
</admon>

[DVC Studio client access token]:
  /doc/studio/user-guide/account-and-billing#client-access-tokens
