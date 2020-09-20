# Anonymized Usage Analytics

To help us better understand how DVC is used and improve it, DVC captures and
reports _anonymized_ usage statistics. You will be notified the first time you
run `dvc init`.

## Motivation

Analytics help us to decide on how best to design future features and prioritize
current work. Anonymous aggregates of user analytics allow us to prioritize
fixes and improvements based on how, where and when people use DVC. For example:

- If reflinks (depends on a file system type) are supported for most users, we
  can keep cache protected mode off by default (see `dvc unprotect`).
- Collecting OS information and the way DVC was installed allows us to decide
  which OS platforms and versions to support and prioritize.
- If usage of some command is negligible small it makes us think about issues
  with a command or documentation.

## Retention period

User and event data have a 14 month retention period.

## What

DVC's analytics record the following information per event:

- The DVC version e.g. `0.82.0`
- Whether DVC was installed from a binary release
- Operating system information, e.g. Ubuntu Linux 14.04
- Whether the project uses Git
- Command type e.g. `CmdDataPull`
- Command return code e.g. `1`
- A random user ID (e.g. `8ca59a29-ddd9-4247-992a-9b4775732aad`), generated with
  [`uuid`](https://docs.python.org/3/library/uuid.html)

This _does not allow us to track individual users_ but does enable us to
accurately measure user counts vs. event counts.

## Implementation

The code is viewable in
[`analytics.py`](https://github.com/iterative/dvc/blob/master/dvc/analytics.py).
They are done in a separate background process and fail fast to avoid delaying
any execution. They will fail immediately and silently if you have no network
connection.

DVC's analytics are sent through DVC's proxy to Google Analytics over HTTPS.

## Opting out

DVC analytics help the entire community, so leaving it on is appreciated.
However, if you want to opt out of DVC's analytics, you can disable it via
`dvc config` command:

```dvc
$ dvc config core.analytics false
```

This will disable it for the <abbr>project</abbr>. Alternatively, you can use
the `--global` or `--system` options of `dvc config` to disable analytics for
the active user or for everyone in the system, respectively.
