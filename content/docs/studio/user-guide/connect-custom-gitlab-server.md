# Connect a Custom GitLab Server

If your team’s Git repositories are on a self-hosted GitLab server, you can set
up a connection to this server such that all your team members can connect to
the Git repositories on this server. Refer to the
[GitLab docs](https://about.gitlab.com/install/) for more details about
self-hosted GitLab servers.

To connect to your self-hosted GitLab server, you will need the following:

- A URL for your GitLab server. The URL should either be publicly accessible, or
  in the same private network as Iterative Studio if Iterative Studio is
  deployed on-premises.
- A GitLab personal access token with the following roles: `api`, `read_user`,
  `read_repository`. If you do not have a personal access token yet, you can
  create one at

  `\<your GitLab server URL>/-/profile/personal_access_tokens?name=Iterative+Studio+Access+token&scopes=api,read_user,read_repository`

Once you have obtained the URL and Personal Access Token for your GitLab server,
do the following:

- Go to you team’s settings at
  `https://studio.iterative.ai/team/<your team name>/settings`
- In the `GitLab connections` section, click on the `Connect GitLab server`
  button
- Enter the URL and token in the form that opens up
- Click on `Connect`

Once the connection is successful, all the repositories in this GitLab server
will become available when you try to add a project in your team workspace. If
you have any trouble setting up the connection to your GitLab server, please
[contact us](/doc/studio/troubleshooting#support).

<admon type ="info">

Connecting to a self-hosted GitLab server is different from connecting to your
account on GitLab SaaS ([gitlab.com](http://gitlab.com/)). To connect to GitLab
SaaS go to the `Git integrations` section in your
[personal profile settings](https://studio.iterative.ai/user/_/profile). If you
signed up to use Iterative Studio using your GitLab account, you may already
have this connection.

</admon>

<admon type ="info">

Custom GitLab server support is available only within a team workspace, and is
available to all Iterative Studio teams (free and paid).

</admon>

## My GitLab server is behind a firewall. What should I do?

Firstly, the GitLab server must be exposed to the internet to enable remote
access from the Studio. You can limit the traffic on the firewall to the server
to allow access from our IP addresses only, which are:

```
3.21.85.173/32
3.142.203.124/32
```

Additionally, the DNS records associated with the GitLab server should be
publicly available to resolve the server name. Use
[DNS Propagation Checker](https://www.whatsmydns.net/) to confirm if the GitLab
domain is resolvable. If you still have any trouble setting up the connection to
your GitLab server, please [contact us](/doc/studio/troubleshooting#support).
