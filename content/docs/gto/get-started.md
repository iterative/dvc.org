---
description:
  'Learn how you can use GTO to create Artifact Registry in Git repository'
---

# Get Started

GTO helps you manage machine learning artifact versions in a Git repository, and
their deployment stages (testing, shadow, production, etc.).

Assuming GTO is already [installed](/doc/gto/install) in your Python
environment, let's clone an [example model registry] and review it's current
state with `gto show`:

[example model registry]: https://github.com/iterative/example-gto

```cli
$ git clone https://github.com/iterative/example-gto
$ cd example-gto

$ gto show
╒══════════╤══════════╤════════╤═════════╤════════════╕
│ name     │ latest   │ #dev   │ #prod   │ #staging   │
╞══════════╪══════════╪════════╪═════════╪════════════╡
│ churn    │ v3.1.1   │ v3.1.1 │ v3.0.0  │ v3.1.0     │
│ segment  │ v0.4.1   │ v0.4.1 │ -       │ -          │
│ cv-class │ v0.1.13  │ -      │ -       │ -          │
╘══════════╧══════════╧════════╧═════════╧════════════╛
```

3 artifacts (models `churn`, `segment`, and `cv-class`) and their `latest`
versions (per [SemVer](https://semver.org)) are listed. We also have 3 stages:
`dev`, `prod`, and `staging`. The model versions (if any) assigned to each stage
are shown.

## Registering a new version

`gto register` lets you mark significant artifact versions (e.g. an ML model
release). Let's register a new version of `cv-class` and check the registry
status again:

```cli
$ gto register cv-class
Created git tag 'cv-class@v0.1.14' that registers version
To push the changes upstream, run:
    git push origin cv-class@v0.1.14

$ gto show
╒══════════╤══════════╤════════╤═════════╤════════════╕
│ name     │ latest   │ #dev   │ #prod   │ #staging   │
╞══════════╪══════════╪════════╪═════════╪════════════╡
│ churn    │ v3.1.1   │ v3.1.1 │ v3.0.0  │ v3.1.0     │
│ segment  │ v0.4.1   │ v0.4.1 │ -       │ -          │
│ cv-class │ v0.1.14  │ -      │ -       │ -          │
╘══════════╧══════════╧════════╧═════════╧════════════╛
```

This creates a Git tag attached to the latest Git commit (`HEAD`) which bumps
the artifact's version automatically (in this case from `v0.1.13` to `v0.1.14`).

## Assigning stages

The version we just registered looks very promising. You can promote it with
`gto assign`, for example to the `dev` stage (for testing):

```cli
$ gto assign cv-class --stage dev
Created git tag 'cv-class#dev#1' that assigns stage to version 'v0.1.14'
To push the changes upstream, run:
    git push origin cv-class#dev#1

$ gto show
╒══════════╤══════════╤═════════╤═════════╤════════════╕
│ name     │ latest   │ #dev    │ #prod   │ #staging   │
╞══════════╪══════════╪═════════╪═════════╪════════════╡
│ churn    │ v3.1.1   │ v3.1.1  │ v3.0.0  │ v3.1.0     │
│ segment  │ v0.4.1   │ v0.4.1  │ -       │ -          │
│ cv-class │ v0.1.14  │ v0.1.14 │ -       │ -          │
╘══════════╧══════════╧═════════╧═════════╧════════════╛
```

This also creates a Git tag, which associates the latest version of `cv-class`
(`v0.1.14`) to `dev`.

## Act in CI/CD upon registrations and assignments

You may have noticed that `gto` reminds you how to `git push` the [tags] created
during registrations and promotions. The benefit of these Git-native mechanism
is that you can act upon GTO operations in any Git-based system downstream, for
example automating model deployments with CI/CD.

[tags]: /doc/gto/user-guide#git-tags-format

<details>

### Click to set up a Git remote you can push to.

<admon type="info">

You'll need a [GitHub account](https://github.com/signup)) for this.

</admon>

1. [Fork the example repo]. Make sure you uncheck "Copy the `main` branch only"
   to preserve the repo's tags.

2. Enable the [workflows] in your fork's **Settings** -> **Actions** page. Now
   its [preconfigured jobs] will trigger when Git tags are pushed.

[fork the example repo]: https://github.com/iterative/example-gto/fork
[workflows]: https://docs.github.com/en/actions/using-workflows/about-workflows
[preconfigured jobs]:
  https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml

3. Update your local repo's default remote (`origin`) with your fork (replace
   `myuser` with your GitHub username):

   ```cli
   $ git remote update origin https://github.com/myuser/example-gto
   ```

</details>

To trigger your CI/CD workflows, you can push any of the Git tags created with
GTO, for example the [latest model version](#registering-a-new-version):

```cli
$ git push origin cv-class@v0.1.14
* [new tag]         cv-class@v0.1.14 -> cv-class@v0.1.14
```

Alternatively, GTO operations can target another `--repo` directly. Let's try
the [stage assignment](#assigning-stages) again for example, but on your remote:

```cli
# Replace myuser with your GitHub user below.
$ gto assign cv-class --stage dev \
             --repo https://github.com/myuser/example-gto
Created git tag 'cv-class#dev#1' that assigns stage to version 'v0.1.14'
Running `git push origin cv-class#dev#1`
Successfully pushed git tag cv-class#dev#1 on remote.
```

Note that the tag is created locally first (if not present) and then pushed to
the target repo.

<admon type="info">

To see what the example repo's [CI/CD jobs] look like, see its [GitHub Actions]
page.

[ci/cd jobs]:
  https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml
[github actions]: https://github.com/iterative/example-gto/actions

</admon>

## What's next?

Thanks for completing this Get Started!

- Learn how to
  [get your artifacts](/doc/gto/user-guide#getting-artifacts-downstream) when
  you need them (e.g. get the latest version or the version in specific stage).
- Learn more about [acting in CI/CD](/doc/gto/user-guide#acting-in-cicd) upon
  version registrations and stage assignments.
- Reach us out in [GH issues](https://github.com/iterative/gto/issues) or in
  [Discord](https://discord.com/invite/dvwXA2N) to get your questions answered!
