# Version models

You can register new versions of registered models by specifying the Git
commit which corresponds to the new version.

To register a new version of a model, Iterative Studio uses [GTO] to create an
[annotated Git tag][git tag] with the specified version number. Refer the [GTO
docs][gto] to see the exact format of the Git tag.

You can register versions using the [GTO] command line interface (CLI). To
register versions using Iterative Studio, watch this tutorial video or read on
below:

**_TODO: Replace the below with the tutorial video on registering a new version
of a model_**

https://www.youtube.com/watch?v=hKf4twg832g

1. On the model details page, click on `Register new version`. The registration
   action can also be initiated from the models dashboard or from the related
   project’s experiment table as shown in the above video.

2. Select the Git commit which corresponds to the new version of your model. If
   the desired commit does not appear in the commit picker, type in the
   7-character SHA of the commit.
3. Enter a version name. Version names must start with the letter `v` and should
   follow the [SemVer] format after the letter `v`. Below are some examples of valid and
   invalid version names:

   - Valid: v0.0.1, v1.0.0, v12.5.7
   - Invalid: 0.0.1 (missing `v` in the beginning), v1.0 (missing the patch
     segment of the [Semver], v1.0.new (using an invalid value `new` as the
     patch number).

4. Optionally, provide a Git tag message.
5. Click on `Register version`.
6. At this point, if you reload the model details page, you will see that a new
   version for your model has been registered. This information is available in
   the model `History` section as well as in the versions drop down.
7. If you go to your Git repository, you will see that a new Git tag referencing
   the selected commit has been created, indicating the new version.

[gto]: https://github.com/iterative/gto
[semver]: https://semver.org/
[git tag]: https://git-scm.com/docs/git-tag
