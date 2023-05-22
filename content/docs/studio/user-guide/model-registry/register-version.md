# Version models

You can register new versions of registered models by specifying the Git commit
which corresponds to the new version.

To register a new version of a model, Iterative Studio uses [GTO] to create an
annotated [Git tag][git tag] with the specified version number. Refer to the
[GTO docs][gto-format] to see the exact format of the Git tag.

To register versions using Iterative Studio, watch this tutorial video or read
on below:

https://www.youtube.com/watch?v=eA70puzOp1o

1. On the models dashboard, open the 3-dot menu for the model whose version you
   want to register. Then, click on `Register new version`. The registration
   action can also be initiated from the model details page or from the related
   project’s experiment table - look for the `Register version` button or icon.

2. Select the Git commit which corresponds to the new version of your model. If
   the desired commit does not appear in the commit picker, type in the
   40-character sha-1 hash of the commit.
3. Enter a version name. Version names must start with the letter `v` and should
   follow the [SemVer] format after the letter `v`. Below are some examples of
   valid and invalid version names:

   - Valid: v0.0.1, v1.0.0, v12.5.7
   - Invalid: 0.0.1 (missing `v` in the beginning), v1.0 (missing the patch
     segment of the [Semver], v1.0.new (using an invalid value `new` as the
     patch number).

4. Optionally, provide a Git tag message.
5. Click on `Register version`.

Once the action is successful, the newly registered version will show up in the
`Latest version` column of the models dashboard. Note that this will happen only
if the newly registered version is the greatest semantic version for your model.
For example, if your model already had v3.0.0 registered, then if you register a
smaller version (e.g., v2.0.0), then the new version will not appear in the
`Latest version` column.

If you open the model details page, the newly registered version will be
available in the model `History` section as well as in the versions drop down.

If you go to your Git repository, you will see that a new Git tag referencing
the selected commit has been created, representing the new version.

[gto]: https://mlem.ai/doc/gto
[git tag]: https://git-scm.com/docs/git-tag
[gto-format]: https://mlem.ai/doc/gto/user-guide#git-tag-message-format
[`gto` cli]: https://mlem.ai/doc/gto/command-reference
[semver]: https://semver.org/
