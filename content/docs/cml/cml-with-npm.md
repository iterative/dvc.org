# CML with NPM

In the above examples, CML is pre-installed in a custom Docker image, which is
pulled by a CI runner. You can also install CML as a package:

```bash
npm i -g @dvcorg/cml
```

You may need to install additional dependencies to use DVC plots and Vega-Lite
CLI commands:

```bash
sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
          librsvg2-dev libfontconfig-dev
npm install -g vega-cli vega-lite
```

CML and Vega-Lite package installation require `npm` command from Node package.
Below you can find how to install Node.

### Install Node in GitHub

In GitHub there is a special action for NPM installation:

```bash
uses: actions/setup-node@v1
  with:
    node-version: '12'
```

### Install Node in GitLab

GitLab requires direct installation of the NMP package:

```bash
curl -sL https://deb.nodesource.com/setup_12.x | bash
apt-get update
apt-get install -y nodejs
```
