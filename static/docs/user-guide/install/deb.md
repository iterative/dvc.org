# Installation from a DEB package

1. Install from the DVC deb repo:

   ```dvc
   $ sudo wget \
          https://dvc.org/deb/dvc.list \
          -O /etc/apt/sources.list.d/dvc.list

   $ sudo apt update

   $ sudo apt install dvc
   ```

2. Alternatively, you can get the DEB package from the big "Download" button on
   the [home page](/), or from the
   [release page](https://github.com/iterative/dvc/releases/) on GitHub. Then
   install it like this:

   ```dvc
   $ sudo apt install ./dvc_0.62.1_amd64.deb
   ```

3. Bash completion should work out of the box on Debian and Ubuntu. But if not,
   try
   [these instructions](/doc/user-guide/install/completion#bash-completion-on-ubuntu).
