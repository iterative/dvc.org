# Installation from a RPM package

1. Install from the DVC rpm repo:

   ```dvc
   $ sudo wget \
          https://dvc.org/rpm/dvc.repo \
          -O /etc/yum.repos.d/dvc.repo

   $ sudo yum update

   $ sudo yum install dvc
   ```

2. Alternatively, you can get the RPM package from the big "Download" button on
   the [home page](/), or from the
   [release page](https://github.com/iterative/dvc/releases/) on GitHub. Then
   install it like this:

   ```dvc
   $ sudo yum install dvc-0.62.1-1.x86_64.rpm
   ```

3. Bash completion should work out of the box. But if not, check
   [these instructions](install/completion#bash-completion-on-ubuntu).
