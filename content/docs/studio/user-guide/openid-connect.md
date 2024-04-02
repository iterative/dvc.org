# OpenID Connect (OIDC)

DVC Studio can use OpenID Connect to access cloud resources securely, without
requiring manual configuration of static credentials.

To use OIDC, first follow the [cloud configuration](#cloud-configuration)
instructions and then the [Studio configuration](#studio-configuration)
instructions.

## Cloud configuration

<details>

### Generic configuration options

- OpenID Connect Discovery URL:
  https://studio.iterative.ai/api/.well-known/openid-configuration

- Subject claim format: `credentials:{owner}/{name}` where `{owner}` is the name
  of the DVC Studio **user** or **team** owning the credentials, and `{name}` is
  the name of the DVC Studio
  [credentials](/doc/studio/user-guide/account-management#cloud-credentials).

</details>

### Terraform examples

The following Terraform examples illustrate how to configure the supported cloud
providers, granting DVC Studio access to object storage resources through OpenID
Connect. Update the fields as described below and then apply the Terraform
configuration. Make note of the outputs of `terraform apply`, since you will
need to enter those for [Studio configuration](#studio-configuration).

<admon type="tip">

Replace the sample `credentials:example-team/example-credentials` subject claim
condition. Replace `example-team` with the Studio **user** or **team** owning
the credentials, and replace `example-credentials` with any name you want to use
for those credentials. This name must match what you enter during
[Studio configuration](#studio-configuration).

</admon>

<details>

### Amazon Web Services

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

locals {
  provider  = "studio.iterative.ai/api"
  condition = "credentials:example-team/example-credentials"
}

data "tls_certificate" "studio" {
  url = "https://${local.provider}"
}

data "aws_iam_policy_document" "studio_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.studio.arn]
    }

    condition {
      test     = "ForAnyValue:StringLike"
      variable = "${aws_iam_openid_connect_provider.studio.url}:sub"
      values   = [local.condition]
    }
  }
}

data "aws_iam_policy_document" "studio" {
  statement {
    actions   = ["s3:*"]
    resources = ["*"]
  }
}

resource "aws_iam_openid_connect_provider" "studio" {
  url             = data.tls_certificate.studio.url
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.studio.certificates.0.sha1_fingerprint]
}

resource "aws_iam_role" "studio" {
  max_session_duration = 12 * 60 * 60 # 12 hours
  assume_role_policy   = data.aws_iam_policy_document.studio_assume_role.json

  inline_policy {
    name   = "studio"
    policy = data.aws_iam_policy_document.studio.json
  }
}

output "role_arn" {
  value = aws_iam_role.studio.arn
}
```

</details>
<details>

### Google Cloud

```hcl
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.13.0"
    }
  }
}

provider "google" {
  project = "iterative-sandbox"
  region  = "us-central1"
}

locals {
  provider  = "studio.iterative.ai/api"
  condition = "credentials:example-team/example-credentials"
}

data "google_project" "current" {}

resource "google_project_organization_policy" "credential_lifetime_extension" {
  project    = data.google_project.current.project_id
  constraint = "constraints/iam.allowServiceAccountCredentialLifetimeExtension"

  list_policy {
    allow {
      all = true
    }
  }
}

resource "google_iam_workload_identity_pool" "studio" {
  workload_identity_pool_id = "iterative-studio"
}

resource "google_iam_workload_identity_pool_provider" "studio" {
  workload_identity_pool_provider_id = "studio"
  workload_identity_pool_id          = google_iam_workload_identity_pool.studio.workload_identity_pool_id

  attribute_mapping = {
    "google.subject" = "assertion.sub"
  }

  oidc {
    issuer_uri = "https://${local.provider}"
  }
}

resource "google_service_account" "studio" {
  account_id = "iterative-studio"
}

resource "google_service_account_iam_binding" "workload_identity_binding" {
  service_account_id = google_service_account.studio.name
  role               = "roles/iam.workloadIdentityUser"
  members            = ["principal://iam.googleapis.com/${google_iam_workload_identity_pool.studio.name}/subject/${local.condition}"]
}

resource "google_project_iam_member" "studio" {
  project = data.google_project.current.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.studio.email}"
}

output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.studio.name
}

output "service_account" {
  value = google_service_account.studio.email
}

output "project_id" {
  value = data.google_project.current.project_id
}
```

</details>
<details>

### Microsoft Azure

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.61.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "2.30.0"
    }
  }
}

provider "azuread" {}

provider "azurerm" {
  features {}
}

locals {
  provider  = "studio.iterative.ai/api"
  condition = "credentials:example-team/example-credentials"
}

data "azuread_client_config" "current" {}
data "azurerm_subscription" "current" {}

resource "azuread_application" "studio" {
  display_name = "studio"

  api {
    requested_access_token_version = 2
  }
}

resource "azuread_service_principal" "studio" {
  application_id = azuread_application.studio.application_id
  owners         = [data.azuread_client_config.current.object_id]
}

resource "azuread_application_federated_identity_credential" "studio" {
  application_object_id = azuread_application.studio.object_id
  display_name          = azuread_application.studio.display_name
  audiences             = ["api://AzureADTokenExchange"]
  issuer                = "https://${local.provider}"
  subject               = local.condition
}

resource "azurerm_role_definition" "studio" {
  name  = azuread_application.studio.display_name
  scope = data.azurerm_subscription.current.id
  permissions {
    actions = [
      "Microsoft.Storage/storageAccounts/listKeys/action",
      "Microsoft.Storage/storageAccounts/read",
    ]
  }
}

resource "azurerm_role_assignment" "example" {
  name               = azurerm_role_definition.studio.role_definition_id
  scope              = data.azurerm_subscription.current.id
  role_definition_id = azurerm_role_definition.studio.role_definition_resource_id
  principal_id       = azuread_service_principal.studio.object_id
}

output "azure_subscription_id" {
  value = basename(data.azurerm_subscription.current.id)
}

output "azure_tenant_id" {
  value = data.azurerm_subscription.current.tenant_id
}

output "azure_client_id" {
  value = azuread_application.studio.application_id
}
```

</details>

## Studio configuration

[Create new credentials](/doc/studio/user-guide/account-management#cloud-credentials)
and configure them as follows:

1. Choose an adequate OIDC variant on the provider field; e.g. _Amazon Web
   Services (OIDC)_.
2. Enter the name for the credentials. This must match the name used during
   [cloud configuration](#cloud-configuration).
3. Fill the remaining fields with the outputs of the cloud configuration
   described above.
