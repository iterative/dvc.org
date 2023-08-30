# Create a Project

In this section, you will learn how to:

- [Connect to a Git repository and add a project](#connect-to-a-git-repository-and-add-a-project)
- [Create multiple projects from a single Git repository](#create-multiple-projects-from-a-single-git-repository)
- [Create projects shared across a team](#create-projects-shared-across-a-team)

## Connect to a Git repository and add a project

To add a new project, follow these steps.

1. Sign in to [Iterative Studio](https://studio.iterative.ai/) using your
   GitHub.com, GitLab.com, or Bitbucket.org account, or with your email address.

2. Click on `Add a Project`. All the organizations that you have access to will
   be listed.

<admon type="info">

If you do not see your desired organizations or Git repositories, make sure that
[the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-integrations).

To connect to your GitHub repositories, you must install the Iterative Studio
GitHub app. Refer to the section on
[GitHub app installation](/doc/studio/user-guide/install-github-app) for more
details.

To connect to repositories on your self-hosted GitLab server, you must first add
a connection to this server and create a team. Refer to the section on
[self-hosted GitLab server support](/doc/studio/user-guide/connect-custom-gitlab-server)
for more details.

</admon>

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo_v3.png)

4. Specify additional settings if required.

   ![](https://static.iterative.ai/img/studio/project_settings.png)

> Project settings must be configured if you are connecting to a non-DVC
> repository, if you are connecting to a monorepo, or if your metrics are in
> cloud or other remote storage. You can configure the [Project Settings] after
> the project has been created.

You should now see that a project has been added in your dashboard.

5. If your project requires any of the additional settings, then remember to
   configure them by opening the [project settings]. Otherwise, your project may
   not work as expected. To go to project settings, open the 3-dot menu for the
   project and click on `Settings`.

![](https://static.iterative.ai/img/studio/project_open_settings.png)

[project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project

## Create multiple projects from a single Git repository

You can create multiple projects in Iterative Studio from a single Git
repository and apply different settings to them.

One use case for this is if you have a
**[monorepo](https://en.wikipedia.org/wiki/Monorepo)** with multiple ML
projects, each one in a different sub-directory.

For each ML project in the monorepo, follow the
[above process](#connect-to-a-git-repository-and-add-a-project) to connect to
the Git repository. On the additional settings page [specify the sub-directory]
(or up to 10 comma-separated values) in which the desired ML project resides.

This way, you will have multiple Iterative Studio projects for your single Git
repository, with each project presenting values from a different sub-directory.

[specify the sub-directory]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#project-directory

## Create projects shared across a team

You can [create teams](/doc/studio/user-guide/teams) with one or more team
members, also called collaborators.

Each team will have its own projects dashboard, and the projects that you create
in the team's dashboard will be accessible to all members of the team.

To add more than 2 collaborators in your team,
[upgrade to the **Basic** or **Enterprise** plan](/doc/studio/user-guide/change-team-plan-and-size).
