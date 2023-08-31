# Why GTO?

**GTO** is a tool for creating an Artifact Registry in your Git repository. One
of the special cases we would like to highlight is creating a
[Machine Learning Model Registry](/doc/use-cases/model-registry).

<details>

## Why do we need such a Registry?

Such a registry serves as a centralized place to store and operationalize your
artifacts along with their metadata; manage model life-cycle, versions &
releases, and easily automate tests and deployments using GitOps.

Usually, Artifact Registry usage follows these three steps:

- **Registry**. Track new artifacts and their versions for releases and
  significant changes. Usually this is needed for keeping track of lineage.
- **Lifecycle Management**. Create actionable stages for versions marking status
  of artifact or it's readiness to be consumed by a specific environment.
- **Downstream Usage**. Signal CI/CD automation or other downstream systems to
  act upon these new versions and lifecycle updates.

GTO helps you achieve all of them in a [GitOps](https://www.gitops.tech) way. If
you would like to see an example, please follow
[Get Started](/doc/gto/get-started).

</details>

In Software Engineering, Git is a heart of the Software system. The code is
committed to Git and CI/CD triggers on new commits making the downstream action
necessary. Such approaches as [GitOps](https://www.gitops.tech) made huge steps
towards automation of development cycles, reducing errors and helping maintain
productive software development.

Artifact Registries (and Model Registries in specific) usually introduce a
separate service or infrastructure, as well as new set of APIs to integrate
with. This often leads to a necessity to maintain two different systems, which
is a significant overhead. For example, if you work in Machine Learning, you
often need two teams (Data Science specialists and Software Engineers) each
responsible of maintaining their part of the system.

![](https://i.imgur.com/GTcrytE.png)

GTO builds that on top of Git repository using Git tags to register versions and
assign stages, and using `artifacts.yaml` file to keep the metainformation about
artifacts, such as `path`, `type`, `description` and etc. If your artifact
development is built around Git, you won't need to introduce new things for your
team to manage.

One example (although specific to Model Registry) is really good at
demonstrating this problem of handling two worlds at the same time. When you
train your Machine Learning models, you have to know what code and data was used
to do it. If Model Registry lives in a separate system, you (or the code you've
written) have to record the code and data snapshots (or just a Git commit
hexsha). Now if you forgot to record the hexsha when you registered a new model
version in Model Registry, or used an incorrect hexsha, no one can reproduce
your training process. Keeping track of both models and their versions in Git
solves that problem.

![](https://i.imgur.com/gViAnOu.png)

## Limitations

There are few limitations to the GTO approach to building an Artifact Registry:

- You shouldn't commit artifact binaries to Git itself. You should use Git-lfs,
  or use DVC and other similar tools.
- Some teams develop artifacts (models) in a single monorepository, sometimes in
  many separate ones. Since GTO operates with Git tags and files in a Git
  Repository, it can't handle multiple repositories at a single time.
- GTO is a command-line and Python API tool. That makes it friendly for
  engineers, although for less technical folks a Visual UI may be required.

If you hit the last two limitations, you may find
[Studio](https://dvc.org/doc/studio) useful.
