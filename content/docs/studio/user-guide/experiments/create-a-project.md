# Create a Project

In this section, you will learn how to:

- [Connect to a Git repository and add a project](#connect-to-a-git-repository-and-add-a-project)
- [Create multiple projects from a single Git repository](#create-multiple-projects-from-a-single-git-repository)
- [Create projects shared across a team](#create-projects-shared-across-a-team)

## Connect to a Git repository and add a project

To add a new project, follow these steps.

1. Sign in to DVC Studio using your GitHub.com, GitLab.com, or Bitbucket.org
   account, or with your email address.

2. Click on `Add a Project`. All the organizations that you have access to will
   be listed.

   <admon type="info">

   If you do not see your desired organizations or Git repositories, make sure
   that
   [the connection to your Git server has been set up](/doc/studio/user-guide/account-management#git-connections).

   To connect to your GitHub repositories, you must install the DVC Studio
   GitHub app. Refer to the section on
   [GitHub app installation](/doc/studio/user-guide/git-integrations/github-app)
   for more details.

   To connect to repositories on your self-hosted GitLab server, you must first
   add a connection to this server and create a team. Refer to the section on
   [self-hosted GitLab server support](/doc/studio/user-guide/git-integrations/custom-gitlab-server)
   for more details.

   </admon>

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to directly look for a repository.

   ![](https://static.iterative.ai/img/studio/select_repo_v3.png)

4. Click on the Git repository that you want to connect to.

5. In the `Project settings` page that opens up, you can edit the project name,
   directory and visibility (public accessibility). These settings can also be
   [edited after the project has been created](/doc/studio/user-guide/experiments/configure-a-project).

   <admon type = "info">

   If your DVC repo is in a [sub-directory] of a
   [monorepo](https://en.wikipedia.org/wiki/Monorepo), then you should specify
   the full path to the sub-directory in the `Project directory` setting.

   [sub-directory]:
     /doc/command-reference/init#initializing-dvc-in-subdirectories

   </admon>

   <admon type = "tip">

   You can create multiple projects at once by providing up to 10
   comma-separated values. DVC Studio will create one project for each
   sub-directory in the list.

   </admon>

6. Click on `Create Project`.

You should now see that the project has been added in your dashboard.

## Create multiple projects from a single Git repository

You can create multiple projects in DVC Studio from a single Git repository and
apply different settings to them.

One use case for this is if you have a
**[monorepo](https://en.wikipedia.org/wiki/Monorepo)** with multiple ML
projects, each one in a different sub-directory.

For each ML project in the monorepo, follow the
[above process](#connect-to-a-git-repository-and-add-a-project) to connect to
the Git repository. On the additional settings page [specify the sub-directory]
(or up to 10 comma-separated values) in which the desired ML project resides.

This way, you will have multiple DVC Studio projects for your single Git
repository, with each project presenting values from a different sub-directory.

[specify the sub-directory]:
  /doc/studio/user-guide/experiments/configure-a-project#project-directory

## Create projects shared across a team

You can [create teams](/doc/studio/user-guide/team-collaboration) with one or
more team members, also called collaborators.

Each team will have its own projects dashboard, and the projects that you create
in the team's dashboard will be accessible to all members of the team.

To add more than 2 collaborators in your team,
[upgrade to the **Enterprise** plan](/doc/studio/user-guide/team-collaboration#get-enterprise).
