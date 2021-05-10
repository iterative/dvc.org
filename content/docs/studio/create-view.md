# Create a view

To create a new view for your repository, follow these steps.

1. Click on add a View. All the organizations that you have access to will be
   listed. ![](/img/studio/create_view.png)

2. Open the organization whose repository you want to connect to.
   ![](/img/studio/select_repo.png)

3. Select the Git repository for which you want to create a view. For this,
   hover over the required repository and click on Connect.

4. Once you click on connect, you will be able to specify advanced settings for
   the connection. ![](/img/studio/view_settings.png)

In most scenarios, you can skip the advanced settings. Refer to the 'Advanced
Settings' section to understand when you need to specify these settings.

5. Now, you will see that a view has been added in your dashboard.
   ![](/img/studio/view_added.png)

## Advanced Settings

You will need to speciy advanced settings in the following scenarios.

_Note that you can skip these settings when creating the view. You will be able
to edit the advanced settings later (after you have created the view)._

1. **Monorepo:** If you have connected to a monorepo, then specify the full path
   to the root directory for the project that you want to connect to.

2. **Data remote:** If the metrics and params that you want to include in the
   view are present in a data remote (cloud storage or another location outside
   of the Git repo), then you will have to grant DVC Studio access to the data
   remote. This access will have to be provided after you have connected to the
   repository. When creating the view, you can skip this setting.

3. **Custom files:** DVC Studio automatically detects metrics, plots, and
   parameters files specified in the project's dvc.yaml. If you want to connect
   custom files, you can add them by clicking on the ‘Add file’ button. Enter
   the full file path, and specify whether the file is for Metrics or
   Parameters.
