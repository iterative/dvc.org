# Create a View

To create a new view for your repository, follow these steps.

1. Sign into your [DVC Studio](https://studio.iterative.ai/) dashboard.
   ![](/img/studio/login_home.png)

2. Click on `Add a View`. All the organizations that you have access to will be
   listed. ![](/img/studio/create_view.png)

3. Open the organization whose repository you want to connect to. You can also
   use the search bar to search directly for the repo which you want to connect
   to. ![](/img/studio/select_repo.png)

4. Select the Git repository for which you want to create a view. For this,
   hover over the required repository and click on `Connect`.

5. Once you click on `Connect`, you will be able to specify advanced settings
   for the connection. ![](/img/studio/view_settings.png)

> In most scenarios, you can skip the advanced settings. Refer to the
> [Advanced Settings](#advanced-settings) section below for more details.

You should now see that a view has been added in your dashboard.

![](/img/studio/view_added.png)

If your project requires any of the advanced settings, then remember to
configure them by opening the View settings. Otherwise, your view may not work
as expected. To go to View settings, click on the
![](/img/studio/view_open_settings_icon.png) icon in the view. In the menu that
opens up (highlighted in yellow in the screenshot below), click on `Settings`.

![](/img/studio/view_open_settings.png)

## Advanced Settings

You will need to specify advanced settings in the following scenarios.

> These settings can be skipped when creating the view -- they can be edited
> later.

- **Monorepo:** If you have connected to a
  [monorepo](https://en.wikipedia.org/wiki/Monorepo), then specify the full path
  to the root directory for the project that you want to connect to.

- **Data remotes:** The metrics and parameters that you want to include in the
  view may be present in a data remote (cloud storage or another location
  outside of the Git repo). If you want to include such data in your views, then
  you will have to grant DVC Studio access to the data remote.

- **Custom metrics and parameters:** DVC Studio automatically detects metrics,
  plots, and parameters files specified in the project's `dvc.yaml`. If you want
  to connect custom files, you can add them by clicking on the `Add file`
  button. Enter the full file path, and specify whether the file is for
  `Metrics` or `Parameters`.

## Share a view

You can share your views on the web. Simply click on the button labelled
`Private` next to the name of the view. In the menu that pops up, turn on
`Share to Web`. ![](/img/studio/view_share.png)

You can change a shared (public) view and make it private by turning off
`Share to web`.
