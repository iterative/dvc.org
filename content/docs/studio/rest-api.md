# REST API

The purpose of Studio REST API is to give programmatic access to information in
Studio and executing actions in it.

The API is hosted under the `/api` route on the Studio server:
https://studio.iterative.ai/api or https://your-domain/api in case of
[self-hosted Studio](/doc/studio/self-hosting/installation).

To use API, you need to generate
[Studio access token](/doc/studio/user-guide/account-management#studio-access-token).

## Download model

Get signed URL to download the model binaries for a model from the <abbr>model
registry</abbr>. Requires the model to be stored with DVC with S3 or Azure
[remote]. Note, that you need to
[set up remote cloud credentials](/doc/studio/user-guide/account-management#cloud-credentials)
for Studio to have rights to the signed URLs. The signed URLs expire after one
hour.

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

First, you need your [Studio access token]. For this example, we set it in the
`DVC_STUDIO_TOKEN` environment variable:

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
cloud credentials] in Studio to where the model is stored.

</admon>

[remote]: /doc/user-guide/data-management/remote-storage
[`dvc.yaml`]: /doc/user-guide/project-structure/dvcyaml-files
[Studio access token]:
  /doc/studio/user-guide/account-management#studio-access-token
[set up remote cloud credentials]:
  /doc/studio/user-guide/account-management#cloud-credentials
