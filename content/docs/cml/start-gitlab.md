# Using CML on GitLab

Here, we'll walk through a tutorial to start using CML on GitLab. For
simplicity, we'll show the demo in GitLab Actions, but these instructions are
valid for all supported Continuous Integration (CI) systems (with exceptions as
noted!).

1. Fork our
   [example project repository](https://gitlab.com/iterative.ai/example_cml).
   Click on Fork and select what namespace to fork the project to.

   ![](/img/gitlab_fork_cml_project.png)

   > 💡 If just starting to use GitLab, you may receive a warning at the top of
   > the page regarding SSH keys. You do not need to use SSH keys for the
   > tutorial so you can click: "Don't show me again."  
   > [Click this link for more information on SSH keys.](https://docs.gitlab.com/ee/ssh/)

2. ⚠️ CML in GitLab works exactly as in GitHub except for a few conventions. In
   Gitlab, to use CML, you must create a variable called a repo_token whose
   value is a Personal Access Token. To do this:

   a. Click on your Avatar in the upper right side and click on Edit Profile.

   b. Along the left side of the screen go to Access Tokens.

   c. In the "Name" field, type `repo_token` and check boxes to select `api`,
   `read_repository` and `write_repository`.

   d. Click on the "Create personal access token" button and copy the generated
   access token.

   ![](/img/personal_access_token.png)

   e. Head back to your fork by clicking the Projects tab next to the GitLab
   logo and select it.

   f. On the left hand side Navigate to **Settings** ➡ **CI/CD** ➡ **Varibles**.

   ![](/img/ci_cd_navigation.png)

   f. Scroll to Variables and expand the field. Click "Add Variable". In the Key
   field, type `repo_token`. In the Value field, paste your Personal Access
   Token. Check the "Mask variable" box, uncheck "Protect variable", and then
   save the variable by clicking "Add variable" at the bottom of the dialog box.

> 💡 The following steps can all be done in the GitLab website.
> However, to follow along the steps, we recommend cloning your fork to
> your local workstation.

3. Go back to your forked `example_cml` project. Copy the Clone with HTTPS as
   shown in the image below, and then in your terminal, type the following
   command, replacing `<user_name>` with your own from GitLab.

   ![](/img/gitlab_cml_clone.png)

   ```bash
   git clone https://gitlab.com/<user_name>/example_cml.git
   ```

4. Change directory to `example_cml`

   ```bash
   cd example_cml
   ```

5. To create a CML workflow, use Vim or your editor of choice to copy the
   following into a new file `.gitlab-ci.yml` and save.

   ```yaml
   stages:
     - cml_run

   cml:
     stage: cml_run
     image: dvcorg/cml-py3:latest
     script:
       - pip3 install -r requirements.txt
       - python train.py

       - cat metrics.txt >> report.md
       - cml-publish confusion_matrix.png --md >> report.md
       - cml-send-comment report.md
   ```

6. In your text editor of choice, open `train.py` and edit line 16 to
   `depth = 5`.

7. Commit and push the changes using:

   ```bash
   git checkout -b experiment
   git add . && git commit -m "modify forest depth"
   git push origin experiment
   ```

8. Go back to GitLab in a Browser window and create a merge request.

   ![](/img/create_merge_request.png)

9. If you arrive at a New Merge Request screen that says it's merging into
   anything _other_ than your local repository, click on `Change branches` seen
   here.

   ![](/img/new_merge_request.png)

10. ⚠️ Change target branch to your local branch with your username.

![](/img/change_user_name.png)

11. Click on the "Compare branches and continue" button. Enter any additional
    comments you would like to put in the description and click the "Submit
    merge request" button. Shortly, you should see a comment from github-actions
    appear in the Pull Request with your CML report. This is a result of the
    function cml-send-comment in your workflow.

    ![](/img/cml_start_gitlab_end.png)
