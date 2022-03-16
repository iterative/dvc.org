# Teams

You can define teams with one or more team members. The team members are also
called collaborators, and you can assign different roles to them. The views that
you create in your team's page will be accessible to all members of the team.

In this section, you will:

- [Learn how to create a team](#create-a-team)
- [Learn how to invite collaborators (team members)](#invite-collaborators)
- [Understand the privileges (access permissions) of different roles](#roles)
- [Learn how to manage the team and its views](#manage-your-team-and-its-views)

## Create a team

To create a team, click on the drop down next to `Personal`. All the teams that
you have created so far will be listed within "Teams" in the drop down menu. If
you have not created any team so far, this list will be empty. Now, click on
`Create a team`. ![](https://static.iterative.ai/img/studio/team_create.png)

You will be asked to enter the URL namespace for your team. Enter a unique name.
The URL for your team will be formed using this name.
![](https://static.iterative.ai/img/studio/team_enter_name.png)

Then, click the `Create team` button on the top right corner.

## Invite collaborators

The next step is to invite the team members (or collaborators) for your team.
You can also choose to skip adding collaborators at this point. For this, click
on `Skip and Close` on the top right corner. You will be able to add
collaborators by accessing team settings later.

If you wish to add collaborators now, enter their email addresses. An email
invite will be sent to each invitee, and they will have to join using their
GitHub, GitLab or Bitbucket account.

You can add multiple collaborators. Each collaborator can be assigned the Admin,
Edit, or View role. Refer to the [Roles](#roles) section below for more details
about the roles. ![](https://static.iterative.ai/img/studio/team_roles.png)

Once you have added the people that you wish to add to your team, click on
`Send Invites and Close` on the top right corner.

## Roles

Team members or collaborators can have the View, Edit or Admin roles. Viewers
have read-only access to the views created by other team members. Editors can
create and edit the team's views. And admins have full access to the team's
views and settings. They can add (invite) and remove collaborators as well as
change team settings such as cloud credentials (data remotes).

Iterative Studio does not have the concept of an `Owner` role. The user who
creates the team has the `Admin` role. The privileges of such an admin is the
same as that of any other collaborator who has been assigned the `Admin` role.

> An additional role `Visitor` exists for anonymous users who can open a public
> view.

### Privileges to create, open and access the team's views

| Feature                                    | Visitor | Viewer | Editor | Admin |
| ------------------------------------------ | ------- | ------ | ------ | ----- |
| Open a team's view                         | Yes\*   | Yes    | Yes    | Yes   |
| Apply filters                              | Yes\*   | Yes    | Yes    | Yes   |
| Show / hide columns                        | Yes\*   | Yes    | Yes    | Yes   |
| Save the view filters and columns settings | No      | No     | Yes    | Yes   |
| Run experiments                            | No      | No     | Yes    | Yes   |
| View CML reports                           | No      | No     | Yes    | Yes   |
| Share a view                               | No      | No     | Yes    | Yes   |
| Add a new view                             | No      | No     | Yes    | Yes   |
| Force repository import                    | No      | No     | Yes    | Yes   |
| Delete a view                              | No      | No     | Yes    | Yes   |

\*Visitors can access only the public views of the team.

### Privileges to manage view settings

| Feature                                      | Visitor | Viewer | Editor | Admin |
| -------------------------------------------- | ------- | ------ | ------ | ----- |
| Change view name                             | No      | No     | Yes    | Yes   |
| Specify project directory                    | No      | No     | Yes    | Yes   |
| Use existing cloud / data remote credentials | No      | No     | Yes    | Yes   |
| Configure cloud / data remote credentials    | No      | No     | No     | Yes   |
| Manage mandatory columns (tracking scope)    | No      | No     | Yes    | Yes   |
| Manage custom files                          | No      | No     | Yes    | Yes   |

### Privileges to manage the team

| Feature                   | Visitor | Viewer | Editor | Admin |
| ------------------------- | ------- | ------ | ------ | ----- |
| Manage team settings      | No      | No     | No     | Yes   |
| Manage team collaborators | No      | No     | No     | Yes   |
| Delete a team             | No      | No     | No     | Yes   |

## Manage your team and its views

Once you have created the team, the team's page opens up.

![](https://static.iterative.ai/img/studio/team_page.png)

On this page, you can perform three types of tasks:

- **Add a view.** Click on the `View` menu item to add views to the team's page.
  The process for adding a view is the same as that for adding personal views
  ([instructions](/doc/studio/user-guide/views/create-view)). However, the views
  that you create within the team will be accessible to all members
  (collaborators) of the team.

- **Edit collaborators.** You can click on the `Team` menu item to edit the
  collaborators in the team.

- **Change settings.** Finally, you can click on the `Settings` menu item to
  change the team name, add credentials for the data remotes, and delete the
  team. Note that these settings are applicable to the team and are thus
  different from [view settings](/doc/studio/user-guide/views/view-settings).

  ![](https://static.iterative.ai/img/studio/team_settings.png)
