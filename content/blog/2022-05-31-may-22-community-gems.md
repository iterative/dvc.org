---
title: May '22 Community Gems
date: 2022-05-31
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with CML and GCP, DVC data and remotes, DVC pipelines and setups, and
  more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with CML and GCP, DVC data and remotes, DVC pipelines and setups, and
  more.
picture: 2022-05-31/may-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/may-22-community-gems/1184
tags:
  - DVC Remotes
  - Pipelines
  - CML
  - GCP
  - Community
---

### [Is it possible to export a plot generated using `dvc plots diff HEAD main` to vega-lite for use in CML](https://discord.com/channels/485586884165107732/563406153334128681/965911829538832435)

Thanks for the awesome question @dominic!

You can use the `dvc plots diff --show-vega` command to export the plot to
vega-lite on a single graph. You'll need to run the following command:

```dvc
$ dvc plots diff HEAD main --targets prediction.json --show-vega > vega.json
```

You can also include this plot in a comment with CML so that it appears
on your pull requests in GitHub.

### [What is the difference between `dvc pull` and `dvc checkout`?](https://discord.com/channels/485586884165107732/563406153334128681/966739538888241192)

Great question @Derek!

Here are some explanations around how `dvc pull` and `dvc checkout` work.
They're comparable to `git pull` and `git checkout`.

- `dvc pull` fetches data from your remote cache and adds it to your local cache
- `dvc checkout` syncs data from your local cache to your workspace

### [Is there a way to add all of the `outs` of a `foreach` job to the `deps` of a downstream stage?](https://discord.com/channels/485586884165107732/563406153334128681/967709548393672734)

Very interesting question from @mathematiguy!

One way to do this is to have all `foreach` stages write out to different paths
within the same directory and then track the entire directory as a dependency of
your downstream stage.

Here's an example of how that might look in your `dvc.yaml` file.

```yaml
stages:
  cleanups:
    foreach:
      - raw1
      - labels1
      - raw2
    do:
      cmd: echo "${item}" > "data/${item}"
      outs:
        - data/${item}

  reduce:
    cmd: echo file > file
    deps:
      - data
    outs:
      - file
```

### [Is there a way to version and move data from one cloud storage to another with DVC remotes?](https://discord.com/channels/485586884165107732/563406153334128681/968778284114538496)

Wonderful question from @Hisham!

There are a couple of ways you can do this. One approach is to use
`dvc add --to-remote`.

The other approach is to use the
[`import-url`](https://dvc.org/doc/command-reference/import-url#example-transfer-to-remote-storage)
functionality. You can see an example of how to do this in the docs. Just make
sure that you have your remotes set up!

### [If I'm using Feast feature store, is it possible to version datasets with DVC?](https://discord.com/channels/485586884165107732/563406153334128681/968899175561449532)

This is a good integration question from @Bernardo Galvao!

If you want to fetch historical features from the offline store to generate
training data, a typical pattern would be to write the script to do so and set
up a DVC pipeline stage to track that script and version the output file. This
is similar to how a lot of people use DVC alongside SQL databases.

### [How can I run a DVC pipeline in a Docker container?](https://discord.com/channels/485586884165107732/563406153334128681/969640280263389184)

Nice question from @Anudeep!

Here's an example of a Dockerfile with a simple DVC setup.

```docker
FROM ubuntu:latest
RUN apt-get update && apt install -y python-is-python3 python3-pip
WORKDIR /dvc_project

COPY . .
pip install -r requirements.txt # assuming your requirements, including dvc, are here
CMD dvc pull && dvc exp run
```

You would save this file and then run the following commands in your terminal.

```dvc
$ docker build -t "myproject-dvc-exp-run" .
$ docker run myproject-dvc-exp-run
```

You could also use the `dvc repro` command or any of the other DVC commands.

### [How can I reset a repository and start fresh with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/970344379938127892)

Nice question from @strickvl!

There are a couple of ways to do this.

You can remove all the `.dvc` files and the `.dvc` folder in the root directory
manually, but keep in mind that **any data versioned with DVC will be deleted**,
since it's stored in `.dvc/cache`. After that you can re-initialize the repo
with `dvc init`.

There is also the `dvc destroy` command that will remove all DVC file and
internals from your repository.

### [Is there an example of using CML with GCP that can be used as a reference?](https://discord.com/channels/485586884165107732/728693131557732403/963512513452970086)

Excellent question from @sabygo!

Here is a GitHub Actions snippet to get you started:

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: iterative/setup-cml@v1
      - name: Deploy runner
        env:
          GOOGLE_APPLICATION_CREDENTIALS_DATA: ${{ secrets.GCP_CML_RUNNER_KEY }}
        run: |
          cml runner \
            --single \
            --labels=cml-gcp \
            --token=${{ secrets.GCP_SECRET }} \
            --cloud=gcp \
            --cloud-region=us-west \
            --cloud-type=e2-highcpu-2
  test:
    needs: [setup]
    runs-on: [self-hosted, cml-gcp]
    steps:
      - uses: actions/checkout@v2
      # - uses: iterative/setup-cml@v1
      - run: |
          echo "model training"
```

### [Can I use preemptive instances provided by GCP as a `cml-runner`?](https://discord.com/channels/485586884165107732/728693131557732403/964860322710192202)

Good question from @Atsu!

Yes! You can use `cml runner --cloud-spot` to request a preemptive instance.

---

https://media.giphy.com/media/bg1MQ6IUVoVOM/giphy.gif

At our June Office Hours Meetup we will ...! [RSVP for the Meetup here]() to
stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
