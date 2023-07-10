# REST API

Studio REST API is WIP and will be extended. The API is hosted under the `/api`
route on the Studio server: https://studio.iterative.ai/api or
https://your-domain/api in case of
[self-hosted Studio](/doc/studio/self-hosting/installation).

To use API, you need to generate
[Studio access token](/doc/studio/user-guide/account-management#studio-access-token).

## Download model

Get signed url to download the model binary. Requires the model to be stored
with DVC with s3 or azure remote. `path` in model annotation must point to a
single file and not to a directory. Note, that you need to
[set up remote cloud credentials](https://dvc.org/doc/studio/user-guide/account-management#cloud-credentials)
for Studio have rights to sign urls.

```yaml
Endpoint: api/download-model
HTTP Method: GET
```

### Request

```yaml
params:
  url:
    desc: Git repo URL
    type: string
    required: true
  name:
    desc: Model name
    type: string
    required: true
  version:
    desc: Model version
    type: string
    required: true
headers:
  Authorization: 'token <TOKEN>'
```

### Response

Response is a json-encoded dict. If the request was successful, keys will be
paths to files inside the repo, and values will be signed urls you can query to
actually download the model.

### Example curl

```
$ curl https://studio.iterative.ai/api/download-model?url=git@github.com:iterative/demo-bank-customer-churn.git&name=randomforest-model&version=v2.0.0 --header "Authorization:token <TOKEN>"

{
    ".mlem/model/clf-model": "https://sandbox-datasets-iterative.s3.amazonaws.com/bank-customer-churn/86/bd02376ac675568ba2fac566169ef9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU7UXIWDIQFPCO76Q%2F20230706%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230706T134619Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6807259ddd1f4448ed1e3c5d4503039884f7779381ee556175096b0a884ba1a6"
}
```
