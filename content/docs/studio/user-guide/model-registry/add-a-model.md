# Add a model

You can add models from any ML project to the model registry. To add a model to
your model registry, Iterative Studio creates an annotation for it in a
`dvc.yaml` file in your Git repository. If you are using the [GTO] command line
tool, you can also add models [from the CLI][gto annotate]. To add models using
Iterative Studio, watch this tutorial video or read on below:

https://www.youtube.com/watch?v=szzv4ZXmYAs

1. Click on `Add a model`.

2. Select a [connected repository] to which you want to add the model.

   <admon>

   If your model file or the `.dvc` file for your model already exists in a Git
   repo, select that repo. If your model file resides in remote storage (S3,
   GCS, etc.), select the Git repo where you want to add the model.

   </admon>

3. Enter the path of the model file as follows:

   - If the model file is in the Git repository (including if it is saved with
     DVC and/or [MLEM]), enter the relative path of the model (from the
     repository root).
   - Otherwise, enter the URL to the model file in the cloud.

   If the path you entered is a cloud path, Iterative Studio will ask you for
   the repository path where the dvc reference to the model should be saved.

4. Provide labels for your model. For example, if your model is about reviewing
   sentiment analysis using natural language processing, one of the labels may
   be `nlp`. You can provide multiple labels as a comma separated list. Eg,
   `nlp, sentiment_analysis`.

5. Optionally, add a brief description for your model.

6. Enter a Git commit message. Then, select the branch to commit to. You can
   commit to either the base branch or a new branch. Iterative Studio will
   commit the changes to the selected branch. If you commit to a new branch,
   Iterative Studio will also create a Git pull request from the new branch to
   the base branch.

7. Now, click on `Commit changes`.

8. At this point, the new model appears in the models dashboard.

9. In your Git repository, you will find that an entry for the new model has
   been created in the `dvc.yaml` file in the repository's root. If you had
   committed to a new branch, a new pull request (or merge request in the case
   of GitLab) will also have been created to merge the new branch into the base
   branch.
10. If you had added a model from a cloud storage, the following will also
    happen before the commit is created:

    - If the repository does not contain DVC, Iterative Studio will run
      `dvc init`. It is needed to version the model in the git repository.
      [Learn more](/doc/command-reference/init).
    - If the specified directory does not exist yet, it will be created.
    - Iterative Studio will import the model to the repository by executing
      `dvc import-url <remote_path> <directory_path>/<filename from remote_path> --no-exec`.
    - Iterative Studio annotate the model by executing
      `gto annotate <model_name> --path <directory_path>/<filename from remote_path> --type model`.
      [Learn more][gto annotate].

[connected repository]:
  /doc/studio/user-guide/projects-and-experiments/create-a-project
[gto]: https://mlem.ai/doc/gto
[gto annotate]: https://mlem.ai/doc/gto/command-reference/annotate
[mlem]: https://mlem.ai/
