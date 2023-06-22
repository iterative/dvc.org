# Teams

You can create teams with one or more team members. The team members are also
called collaborators, and you can assign different roles to them. The projects
that you create in your team's page will be accessible to all members of the
team.

In this page, you will learn about:

- [How to create a team](#create-a-team)
- [How to invite collaborators (team members)](#invite-collaborators)
- [The privileges (access permissions) of different roles](#roles)
- [How to manage the team and its projects](#manage-your-team-and-its-projects)
- [How to manage connections to self-hosted GitLab servers](#manage-connections-to-self-hosted-gitlab-servers)
- [Why and how to change your team plan and team size](#change-your-team-plan-and-team-size)

## Create a team

To create a team, click on the drop down next to `Personal`. All the teams that
you have created so far will be listed within "Teams" in the drop down menu. If
you have not created any team so far, this list will be empty. Now, click on
`Create a team`. ![](https://static.iterative.ai/img/studio/team_create_v3.png)

You will be asked to enter the URL namespace for your team. Enter a unique name.
The URL for your team will be formed using this name.
![](https://static.iterative.ai/img/studio/team_enter_name_v3.png)

Then, click the `Create team` button on the top right corner.

## Invite collaborators

The next step is to invite the team members (or collaborators) for your team.
You can also choose to skip adding collaborators at this point. For this, click
on `Skip and Close` on the top right corner. You will be able to add
collaborators by accessing [team settings] later.

If you wish to add collaborators now, enter their email addresses. An email
invite will be sent to each invitee.

You can add multiple collaborators. Each collaborator can be assigned the Admin,
Edit, or View role. Refer to the [Roles](#roles) section below for more details
about the roles. ![](https://static.iterative.ai/img/studio/team_roles_v3.png)

Once you have added the people that you wish to add to your team, click on
`Send Invites and Close` on the top right corner.

[team settings]: /doc/studio/user-guide/teams#settings

## Roles

Team members or collaborators can have the `Viewer`, `Editor` or `Admin` roles.
Viewers have read-only access to the projects created by other team members.
Editors can create and edit the team's projects. And admins have full access to
the team's projects and settings. They can add (invite) and remove collaborators
as well as change team settings such as cloud credentials (data remotes). An
additional role `Visitor` exists for anonymous users who can open a public
project.

Iterative Studio does not have the concept of an `Owner` role. The user who
creates the team has the `Admin` role. The privileges of such an admin is the
same as that of any other collaborator who has been assigned the `Admin` role.

<admon>

If your Git account does not have write access on the Git repository connected
to a project, you cannot push changes (e.g., new experiments) to the repository
even if the project belongs to a team where you are an `Editor` or `Admin`.

</admon>

### Privileges to create, open and access the team's projects

| Feature                                       | Visitor | Viewer | Editor | Admin |
| --------------------------------------------- | ------- | ------ | ------ | ----- |
| Open a team's project                         | Yes\*   | Yes    | Yes    | Yes   |
| Apply filters                                 | Yes\*   | Yes    | Yes    | Yes   |
| Show / hide columns                           | Yes\*   | Yes    | Yes    | Yes   |
| Save the project filters and columns settings | No      | No     | Yes    | Yes   |
| Run experiments                               | No      | No     | Yes    | Yes   |
| View CML reports                              | No      | No     | Yes    | Yes   |
| Share a project                               | No      | No     | Yes    | Yes   |
| Add a new project                             | No      | No     | Yes    | Yes   |
| Force repository import                       | No      | No     | Yes    | Yes   |
| Delete a project                              | No      | No     | Yes    | Yes   |

\*Visitors can access only the public projects of the team.

### Privileges to manage project settings

| Feature                                      | Visitor | Viewer | Editor | Admin |
| -------------------------------------------- | ------- | ------ | ------ | ----- |
| Change project name                          | No      | No     | Yes    | Yes   |
| Specify project directory                    | No      | No     | Yes    | Yes   |
| Use existing cloud / data remote credentials | No      | No     | Yes    | Yes   |
| Configure cloud / data remote credentials    | No      | No     | No     | Yes   |
| Manage columns                               | No      | No     | Yes    | Yes   |
| Manage custom files                          | No      | No     | Yes    | Yes   |

### Privileges to manage the team

| Feature                   | Visitor | Viewer | Editor | Admin |
| ------------------------- | ------- | ------ | ------ | ----- |
| Manage team settings      | No      | No     | No     | Yes   |
| Manage team collaborators | No      | No     | No     | Yes   |
| Delete a team             | No      | No     | No     | Yes   |

## Manage your team and its projects

Once you have created the team, the team's workspace opens up.

![](https://static.iterative.ai/img/studio/team_page_v6.png)

In this workspace, there are 2 pages - [Projects](#projects) and
[Settings](#settings).

## Projects

This is the projects dashboard for the team. All the projects on this dashboard
are accessible to all members (collaborators) of the team.

To add a project to this dashboard, click on `Add a project`. The process for
adding a project is the same as that for adding personal projects
([instructions][project settings]).

## Settings

In the [team settings] page, you can change the team name, add credentials for
the data remotes, and delete the team. Note that these settings are applicable
to the team and are thus different from [project settings].

Additionally, you can also
[manage connections to self-hosted GitLab servers](#manage-connections-to-self-hosted-gitlab-servers),
[edit collaborators](#edit-collaborators) and
[change your team plan](#change-your-team-plan).

[project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project

### Manage connections to self-hosted GitLab servers

If your team’s Git repositories are on a self-hosted GitLab server, you can go
to the `GitLab connections` section of the team settings page to set up a
connection to this server. Once you set up the connection, all your team members
can connect to the Git repositories on this server. For more details, refer to
[Custom GitLab Server Connection](/doc/studio/user-guide/connect-custom-gitlab-server).

### Edit collaborators

To manage the collaborators (team members) of your team, go to the
`Collaborators` section of the team settings page. Here you can invite new team
members as well as remove or change the [roles](#roles) of existing team
members.

The number of collaborators in your team depends on your team plan. By default,
all teams are on the Free plan, and can have 2 collaborators. To add more
collaborators,
[upgrade to the Basic or Enterprise plans](#change-your-team-plan).

All collaborators and pending invites get counted in the subscription. Suppose
you have subscribed for a 10 member team. If you have 5 members who have
accepted your team invite and 3 pending invites, then you will have 2 remaining
seats. This means that you can invite 2 more collaborators. At this point, if
you remove any one team member or pending invite, that seat becomes available
and so you will have 3 remaining seats.

### Change your team plan and team size

Your team can be in the **Free**, **Basic**, **Enterprise** plan. All newly
created teams are on the Free plan. This plan is designed for teams that are
starting out: you can invite one other team member and import as many
repositories as you want. For more advanced collaboration, you can switch to the
Basic or Enterprise plans. A detailed comparison of the different plans can be
found in the Iterative Studio
[pricing page](https://studio.iterative.ai/pricing).

- **To upgrade** from the Free plan to the Basic or Enterprise plan or to
  downgrade your team plan, refer to the section on [changing your team plan].

- **To change the number of seats** in your Basic plan, refer to the section on
  [changing your team size].

[changing your team plan]:
  /doc/studio/user-guide/change-team-plan-and-size#change-the-plan-your-team-is-on
[changing your team size]:
  /doc/studio/user-guide/change-team-plan-and-size#change-the-size-of-your-team
