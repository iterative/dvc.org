import React, { Component } from 'react'

import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { style as codeStyle } from 'react-syntax-highlighter/styles/prism'

import { media } from '../src/styles'

import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import DownloadButton from '../src/DownloadButton'

const Code = ({ source }) => (
  <CodeBlock language="bash" style={codeStyle}>
    {source}
  </CodeBlock>
)

const PartTitle = ({ name, children, small, noline }) => (
  <PartTitleLink id={name} href={`#${name}`} noline={small || noline}>
    <SubHeading small={small}>{children}</SubHeading>
  </PartTitleLink>
)

export default () => (
  <Page stickHeader={true}>
    <Container>
      <Side>
        <Menu>
          <Heading>Documentation</Heading>

          <br />
          <br />
          {/* IN DEV */}
          {/*<SearchArea>*/}
          {/*<SearchForm />*/}
          {/*</SearchArea>*/}

          {/* Sections */}
          <Sections>
            <SectionLinks>
              <SectionLink level={1} href={'#tutorial'}>
                Tutorial
              </SectionLink>
              <SectionLink level={1} href={'#collaboration'}>
                Collaboration issues in data science
              </SectionLink>
              <SectionLink level={1} href={'#tools'}>
                Tools for data scientists
              </SectionLink>
              <SectionLink level={2} href={'#tools_existing'}>
                Existing engineering tools
              </SectionLink>
              <SectionLink level={2} href={'#tools_expirimental'}>
                Experiment management software
              </SectionLink>
              <SectionLink level={1} href={'#what_is_dvc'}>
                What is DVC?
              </SectionLink>
              <SectionLink level={1} href={'#core_features'}>
                Core features
              </SectionLink>
              <SectionLink level={1} href={'#related'}>
                Related technologies
              </SectionLink>
              <SectionLink level={1} href={'#how_does_it_work'}>
                How does it work?
              </SectionLink>
              <SectionLink level={1} href={'#installation'}>
                Installation
              </SectionLink>
              <SectionLink level={2} href={'#installation_os_packages'}>
                OS packages
              </SectionLink>
              <SectionLink level={2} href={'#installation_pip'}>
                Python pip
              </SectionLink>
              <SectionLink level={2} href={'#installation_homebrew'}>
                Homebrew Cask
              </SectionLink>
              <SectionLink level={2} href={'#installation_dev'}>
                Development Version
              </SectionLink>
              <SectionLink level={1} href={'#configuration'}>
                Configuration
              </SectionLink>
              <SectionLink level={2} href={'#configuration_structure'}>
                DVC Files and Directories
              </SectionLink>
              <SectionLink level={1} href={'#configuration_cloud'}>
                Working with Cloud Data Storages
              </SectionLink>
              <SectionLink level={1} href={'#commands'}>
                Using DVC Commands
              </SectionLink>
              <SectionLink level={2} href={'#commands_cheat_sheet'}>
                DVC Commands Cheat Sheet
              </SectionLink>
              <SectionLink level={1} href={'#commands_command_reference'}>
                DVC Command Reference
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_init'}>
                init
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_add'}>
                add
              </SectionLink>
              <SectionLink
                level={2}
                href={'#commands_command_reference_checkout'}
              >
                checkout
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_run'}>
                run
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_push'}>
                push
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_pull'}>
                pull
              </SectionLink>
              <SectionLink
                level={2}
                href={'#commands_command_reference_status'}
              >
                status
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_repro'}>
                repro
              </SectionLink>
              <SectionLink
                level={2}
                href={'#commands_command_reference_remove'}
              >
                remove
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_gc'}>
                gc
              </SectionLink>
              <SectionLink
                level={2}
                href={'#commands_command_reference_config'}
              >
                config
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_show'}>
                show
              </SectionLink>
              <SectionLink level={2} href={'#commands_command_reference_fsck'}>
                fsck
              </SectionLink>
              <SectionLink level={1} href={'#common_arguments'}>
                Common Arguments
              </SectionLink>
              <SectionLink level={2} href={'#common_arguments_options'}>
                Common Options
              </SectionLink>
              <SectionLink
                level={2}
                href={'#common_arguments_number_of_dvc_jobs'}
              >
                Number of DVC Jobs
              </SectionLink>
            </SectionLinks>
          </Sections>
          {/* /Sections */}

          <OnlyDesktop>
            <DownloadButton />
          </OnlyDesktop>
        </Menu>
      </Side>
      <Content>
        <Inner>
          {/* Content */}
          <Parts>
            <PartTitle name="tutorial" noline>
              DVC Tutorial
            </PartTitle>
            <Paragraph>
              <TutorialLink
                href={`https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46`}
              >
                Tutorial link
              </TutorialLink>
            </Paragraph>
            {/*
            */}
            <PartTitle name="collaboration">
              Collaboration issues in data science
            </PartTitle>
            <Paragraph>
              Even with all the successes today in machine learning (ML),
              specifically deep learning and its applications in business, the
              data science community is still lacking good practices for
              organizing their projects and effectively collaborating across
              their varied ML projects. This is a massive challenge for the
              community and the industry now, when ML algorithms and methods are
              no longer simply "tribal knowledge" but are still difficult to
              implement, reuse, and manage.
            </Paragraph>
            <Paragraph>
              To make progress in this challenge, many areas of the ML
              experimentation process need to be formalized. Many common
              questions need to be answered in an unified, principled way:
            </Paragraph>
            <Paragraph inline>
              <ul>
                <li>
                  <Definition>Source code and data versioning.</Definition>
                  <p>
                    How do you avoid any discrepancies between versions of the
                    source code and versions of the data files when the data
                    cannot fit into a repository?
                  </p>
                </li>
                <li>
                  <Definition>Experiment time log.</Definition>
                  <p>
                    How do you track which of the hyperparameter changes
                    contributed the most to producing your target metric? How do
                    you monitor the extent of each change?
                  </p>
                </li>
                <li>
                  <Definition>Navigating through experiments.</Definition>
                  <p>
                    How do you recover a model from last week without wasting
                    time waiting for the model to re-train?
                  </p>
                  <p>
                    How do you quickly switch between the large data source and
                    a small data subset without modifying source code?
                  </p>
                </li>

                <li>
                  <Definition>Reproducibility</Definition>
                  <p>
                    How do you rerun a model's evaluation without re-training
                    the model and preprocessing a raw dataset?{' '}
                  </p>
                </li>
                <li>
                  <Definition>Managing and sharing large data files</Definition>
                  <p>
                    How do you share models trained in a GPU environment with
                    colleagues who do not have access to a GPU?
                  </p>
                  <p>
                    How do you share the entire 147Gb of your project, with all
                    of its data sources, intermediate data files, and models?
                  </p>
                </li>
              </ul>
            </Paragraph>
            <Paragraph>
              Some of these questions are easy to answer individually. Any data
              scientist, engineer, or manager knows or could easily find answers
              to some of them. However, the variety of answers and approaches
              makes data science collaboration a nightmare.
              <Definition>A systematic approach is required.</Definition>
            </Paragraph>
            <PartTitle name="tools">Tools for data scientists</PartTitle>
            <PartTitle name="tools_existing" small>
              Existing engineering tools
            </PartTitle>
            <Paragraph>
              There is one common opinion regarding data science tooling. Data
              scientists as engineers are supposed to use the best practices and
              collaboration software from software engineering. Source code
              version control system (Git), continuous integration services
              (CI), and unit test frameworks are all expected to be utilized in
              the data science pipeline.
            </Paragraph>
            <Paragraph>
              But a comprehensive look at data science processes shows that the
              software engineering toolset does not cover data science needs.
              Try to answer all the questions from the above using only
              engineering tools, and you are likely to be left wanting for more.
            </Paragraph>
            <PartTitle name="tools_expirimental">
              Experiment management software
            </PartTitle>
            <Paragraph>
              To solve data scientists collaboration issues a new type of
              software was created -{' '}
              <Definition>experiment management software</Definition>. This
              software aims to cover the gap between data scientist needs and
              the existing toolset.
            </Paragraph>
            <Paragraph>
              The experimentation software is usually{' '}
              <Definition>
                user interface (UI) based in contrast to the existing command
                line engineering tools
              </Definition>. The UI is a bridge to a{' '}
              <Definition>separate cloud based environment</Definition>. The
              cloud environment is usually not so fixible as local data
              scientists environement. And the cloud environment is not fully
              integrated with the local environment.
            </Paragraph>
            <Paragraph>
              The separation of the local data scientist environment and the
              experimentation cloud environment creates another discrepancy
              issue and the environment synchronization requires addition work.
              Also, this style of software usually require external services,
              typically accompanied with a monthly bill. This might be a good
              solution for a particular companies or groups of data scientists.
              However a more accessible, free tool is needed for a wider
              audience.
            </Paragraph>
            <PartTitle name="what_is_dvc">What is DVC?</PartTitle>
            <Paragraph>
              Data Version Control, or DVC, is{' '}
              <Definition>
                a new type of experiment management software
              </Definition>{' '}
              that has been built{' '}
              <Definition>
                on top of the existing engineering toolset
              </Definition>{' '}
              and particularly on a source code version control system
              (currently - Git). DVC reduces the gap between the existing tools
              and the data scientist needs. This gives an ability to{' '}
              <Definition>
                use the advantages of the experimentation software while reusing
                existing skills and intuition
              </Definition>.
            </Paragraph>
            <Paragraph>
              The underlying source code control system{' '}
              <Definition>
                eliminates the need to use external services
              </Definition>. Data science experiment sharing and data scientist
              collaboration can be done through regular Git tools (commit
              messages, merges, pull requests, code comments), the same way it
              works for software engineers.
            </Paragraph>
            <Paragraph>
              DVC implements a{' '}
              <Definition>Git experimentation methodology</Definition> where
              each experiment exists with its code as well as data, and can be
              represented as a separate Git branch or commit.
            </Paragraph>
            <Paragraph>
              DVC uses a few core concepts:
              <ul>
                <li>
                  <Definition>Experiment</Definition> is equivalent to a Git
                  branch. Each experiment (extract new features, change model
                  hyperparameters, data cleaning, add a new data source) should
                  be performed in a separate branch and then merged into the
                  master branch only if the experiment is successful. DVC allows
                  experiments to be integrated into a project's history and
                  NEVER needs to recompute the results after a successful merge.
                </li>
                <li>
                  <Definition>Experiment state</Definition> or state is
                  equivalent to a Git snapshot (all committed files). Git
                  checksum, branch name, or tag can be used as a reference to a
                  experiment state.
                </li>

                <li>
                  <Definition>Reproducibility</Definition> - an action to
                  reproduce an experiment state. This action generates output
                  files based on a set of input files and source code. This
                  action usually changes experiment state.
                </li>
                <li>
                  <Definition>Pipeline</Definition> - directed acyclic graph
                  (DAG) of commands to reproduce an experiment state. The
                  commands are connected by input and output files. Pipeline is
                  defined by special
                  <Definition>dvc-files</Definition> (which act like Makefiles).
                </li>
                <li>
                  {' '}
                  <Definition>Workflow</Definition> - set of experiments and
                  relationships among them. Workflow corresponds to the entire
                  Git repository. -
                </li>
                <li>
                  <Definition>Data files</Definition> - cached files (for large
                  files). For data files the file content is stored outside of
                  the Git repository on a local hard drive, but data file
                  metadata is stored in Git for DVC needs (to maintain pipelines
                  and reproducibility).
                </li>
                <li>
                  <Definition>Data cache</Definition>
                  directory with all data files on a local hard drive or in
                  cloud storage, but not in the Git repository.
                </li>
                <li>
                  <Definition>Cloud storage</Definition> support is a compliment
                  to the core DVC features. This is how a data scientist
                  transfers large data files or shares a trained on GPU model to
                  whom who does not have GPU.
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="core_features">Core features</PartTitle>
            <Paragraph>
              <ul>
                <li>
                  DVC works <Definition>on top of Git repositories</Definition>{' '}
                  and has a similar command line interface and Git workflow.
                </li>
                <li>
                  It makes data science projects{' '}
                  <Definition>reproducible</Definition> by creating lightweight
                  pipelines of DAGs.
                </li>
                <li>
                  <Definition>Large data file versioning</Definition> works by
                  creating pointers in your Git repository to the data cache on
                  a local hard drive.{' '}
                </li>
                <li>
                  {' '}
                  <Definition>Programming language agnostic</Definition>:
                  Python, R, Julia, shell scripts, etc. ML library agnostic:
                  Keras, Tensorflow, PyTorch, scipy, etc.{' '}
                </li>

                <li>
                  <Definition>Open-sourced</Definition> and{' '}
                  <Definition>Self-served</Definition>. DVC is free and does not
                  require any additional services.{' '}
                </li>

                <li>
                  DVC supports cloud storage (AWS S3 and GCP storage) for{' '}
                  <Definition>
                    data sources and pre-trained models sharing
                  </Definition>.
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="related">Related technologies</PartTitle>
            <Paragraph>
              Due to the the novelty of this approach, DVC can be better
              understood in comparison to existing technologies and ideas. DVC
              combines a number of existing technologies and ideas into a single
              product with the goal of bringing the best engineering practices
              into the data science process.
            </Paragraph>
            <Paragraph inline>
              <ul>
                <li>
                  <Definition>Git</Definition>. The difference is: -
                  <p>
                    DVC extends Git by introducing the concept of{' '}
                    <Definition>data files</Definition> - large files that
                    should NOT be stored in a Git repository but still need to
                    be tracked and versioned.
                  </p>
                </li>
                <li>
                  <Definition>Workflow management tools</Definition> (pipelines
                  and DAGs): Apache Airflow, Luigi and etc. The differences are:
                  <p>
                    DVC is focused on data science and modeling. As a result,
                    DVC pipelines are lightweight, easy to create and modify.
                    However, DVC lacks pipeline execution features like
                    execution monitoring, execution error handling, and
                    recovering.
                  </p>
                  <p>
                    DVC is purely a command line tool that does not have a user
                    interface and does not run any servers. Nevertheless, DVC
                    can generate images with pipeline and experiment workflow
                    visualization.
                  </p>
                </li>

                <li>
                  <Definition>Experiment management</Definition> software today
                  is mostly designed for enterprise usage. An open-sourced
                  experimentation tool example:{' '}
                  <a href="http://studio.ml/">http://studio.ml/</a>. The
                  differences are:
                  <p>
                    DVC uses Git as the underlying platform for experiment
                    tracking instead of a web application.{' '}
                  </p>
                  <p>DVC does not need to run</p>
                  any services. No user interface as a result, but we expect
                  some UI services will be created on top of DVC.
                  <p>
                    DVC has transparent design: DVC-files, meta files, state
                    file, cache dirs have a simple format and can be easily
                    reused by external tools.
                  </p>
                </li>

                <li>
                  <Definition>Git workflows</Definition> and Git usage
                  methodologies such as Gitflow. The differences are:
                  <p>
                    DVC supports a new experimentation methodology that
                    integrates easily with a Git workflow. A separate branch
                    should be created for each experiment, with a subsequent
                    merge of this branch if it was successful.
                  </p>
                  <p>
                    DVC innovates by allowing experimenters the ability to
                    easily navigate through past experiments without recomputing
                    them.
                  </p>
                </li>
                <li>
                  <Definition>Makefile</Definition> (and it's analogues). The
                  differences are: - DVC utilizes a DAG:
                  <p>
                    The DAG is defined by dvc-files with filenames *Dvcfile* or{' '}
                    {'*<filename>.dvc*'}.
                  </p>
                  <p>
                    One dvc-file defines one node in the DAG. All dvc-files in a
                    repository make up a single pipeline (think a single
                    Makefile). All dvc-files (and corresponding pipeline
                    commands) are implicitly combined through their inputs and
                    outputs, to simplify conflict resolving during merges.{' '}
                  </p>
                  <p>
                    DVC provides a simple command *dvc run CMD* to generate a
                    dvc-file automatically based on the provided command,
                    dependencies, and outputs. - File tracking:{' '}
                  </p>
                  <p>
                    DVC tracks files based on checksum (md5) instead of file
                    timestamps. This helps avoid running into heavy processes
                    like model re-training when you checkout a previous, trained
                    version of a modeling code (Makefile will retrain the
                    model).{' '}
                  </p>
                  <p>
                    DVC uses the files timestamps and inodes for optimization.
                    This allows DVC to avoid recomputing all dependency files
                    checksum, which would be highly problematic when working
                    with large files (10Gb+).
                  </p>
                </li>

                <li>
                  <Definition>Git-annex</Definition>. The differences are:
                  <p>
                    DVC uses the idea of storing the content of large files
                    (that you don't want to see in your Git repository) in a
                    local key-value store and use file symlinks instead of the
                    actual files.{' '}
                  </p>
                  <p>
                    - DVC uses hardlinks instead of symlinks to make user
                    experience better. - DVC optimizes checksum calculation.
                  </p>
                  <p>
                    DVC stores data file metadata in Git repository {'*.dvc/*'},
                    not in the Git tree {'*.git/annex/*'}. As a result, all
                    metadata can be shared through any Git server like Github
                    (Git-annex loses all metadata when shared by Git server).
                  </p>
                </li>

                <li>
                  <Definition>Git-LFS</Definition> (Large File Storage). The
                  differences are:
                  <p>
                    DVC is fully compatible with Git. It does not require
                    special Git servers like Git-LFS demands.
                  </p>
                  <p>
                    DVC does not add any hooks to Git by default. To checkout
                    data files, the <Definition>dvc checkout</Definition>
                    command has to be run after each{' '}
                    <Definition>git checkout</Definition> and{' '}
                    <Definition>git clone</Definition> command.
                  </p>
                  <p>
                    DVC creates hardlinks instead and changes data file
                    permissions to read only. The{' '}
                    <Definition>dvc checkout</Definition> command does not
                    actually copy data files from cache to the working tree, as
                    copying files is a heavy operation for large files (30Gb+).
                  </p>
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="how_does_it_work">How does it work?</PartTitle>
            <Paragraph>
              1. DVC is a command line tool that works on top of Git::
              <Code
                source={`	$ cd my_git_repo
	$ dvc init
`}
              />
            </Paragraph>
            <Paragraph>
              2. DVC helps define pipelines of your commands, and keeps all the
              commands and dependencies in a Git repository::
              <Code
                source={`	$ dvc run -d input.csv -o results.csv python cnn_train.py --seed 20180227 --epoch 20 input.csv result.csv
	$ git add results.csv.dvc
	$ git commit -m 'Train CNN. 20 epochs.'
`}
              />
            </Paragraph>
            <Paragraph>
              3. DVC is programming language agnostic. R command example::
              <Code
                source={`	$ dvc run -d result.csv -o plots.jpg Rscript plot.R result.csv plots.jpg
	$ git add plots.jpg.dvc
	$ git commit -m 'CNN plots'
`}
              />
            </Paragraph>
            <Paragraph>
              4. DVC can reproduce a pipeline with respect to the pipeline's
              dependencies::
              <Code
                source={`	# The input dataset was changed
	$ dvc repro plots.jpg.dvc
	Reproducing 'output.p':
	    python cnn_train.py --seed 20180227 --epoch 20 input.csv output.p
	Reproducing 'plots.jpg':
	    Rscript plot.R result.csv plots.jpg
`}
              />
            </Paragraph>
            <Paragraph>
              5. DVC introduces the concept of data files to Git repositories.
              DVC keeps data files outside of the repository but retains the
              metadata in Git::
              <Code
                source={`	$ git checkout a03_normbatch_vgg16 # checkout code and DVC meta data
	$ dvc checkout # checkout data files from the local cache (not Git)
	$ ls -l data/ # These LARGE files were copied from DVC cache, not from Git
	total 1017488
	-r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
	-r--------  2 501  staff    12G Jan 27 03:48 Posts-train.tsv
`}
              />
            </Paragraph>
            <Paragraph>
              6. DVC makes repositories reproducible. DVC metadata can be easily
              shared through any Git server, and allows for experiments to be
              easily reproduced::
              <Code
                source={`	$ git clone https://github.com/dataversioncontrol/myrepo.git
	$ cd myrepo
	# Reproduce data files
	$ dvc repro
	Reproducing 'output.p':
	    python cnn_train.py --seed 20180227 --epoch 20 input.csv output.p
	Reproducing 'plots.jpg':
	    Rscript plot.R result.csv plots.jpg
`}
              />
            </Paragraph>
            <Paragraph>
              7. DVC's local cache can be transferred to your colleagues and
              partners through AWS S3 or GCP Storage::
              <Code
                source={`	$ git push
	$ dvc push # push the data cache to your cloud bucket

	# On a colleague machine:
	$ git clone https://github.com/dataversioncontrol/myrepo.git
	$ cd myrepo
	$ git pull # get the data cache from cloud
	$ dvc checkout # checkout data files
	$ ls -l data/ # You just got gigabytes of data through Git and DVC:
	total 1017488
	-r--------  2 501  staff   273M Jan 27 03:48 Posts-test.tsv
`}
              />
            </Paragraph>
            <Paragraph>
              8. DVC works on Mac, Linux ,and Windows. A Windows example::
              <Code
                source={`	$ dir
	?????
	????
`}
              />
            </Paragraph>
            <br />
            <PartTitle name="installation">Installation</PartTitle>
            <Paragraph>
              Operating system dependent packages are the recommended way to
              install DVC. Some other methods of installation are available.
            </Paragraph>
            {/*
            */}
            <PartTitle name="installation_os_packages" small>
              OS packages
            </PartTitle>
            <Paragraph>
              DVC installation packages are available for Mac OS, Linux, and
              Windows. You can download the packages{' '}
              <a href="https://github.com/dataversioncontrol/dvc/releases">
                here
              </a>.
            </Paragraph>
            {/*
            */}
            <PartTitle name="installation_pip" small>
              Python pip
            </PartTitle>
            <Paragraph>
              Another option is to use the standard Python pip package::
              <Code
                source={`
	$ pip install dvc
`}
              />
            </Paragraph>
            <Note>
              Note: if you use <Definition>Anaconda</Definition>, it will work
              in <Definition>Anaconda’s</Definition>
              command prompt tool. At the moment, DVC does not provide a special
              installation package for the native{' '}
              <Definition>Anaconda</Definition> package manager
              <Definition>conda</Definition>.
            </Note>
            <PartTitle name="installation_homebrew" small>
              Homebrew Cask
            </PartTitle>
            Mac OS users can install DVC by using the{' '}
            <Definition>brew</Definition> command::
            <Code
              source={`	$ brew cask install dataversioncontrol/homebrew-dvc/dvc`}
            />
            <PartTitle name="installation_dev" small>
              Development Version
            </PartTitle>
            If you would like to pull the latest version of DVC, you can do the
            following::
            <Code
              source={`	$ pip install git+git://github.com/dataversioncontrol/dvc`}
            />
            <Note>
              Note: this will automatically upgrade your DVC version to the
              latest version.
            </Note>
            <PartTitle name="configuration">Configuration</PartTitle>
            ParagraphOnce you install DVC, you will be able to start using it
            (in its local setup) immediately. However, you can proceed to
            configure DVC (especially if you intend to use it in a{' '}
            <Definition>cloud-based</Definition>
            scenario).
            <PartTitle name="configuration_structure" small>
              DVC Files and Directories
            </PartTitle>
            <Paragraph>
              Once installed, DVC will populate its installation folder
              (hereafter referred to as .dvc)
              <ul>
                <li>
                  {' '}
                  <Definition>.dvc/config</Definition> - This is a configuration
                  file. The config file can be edited directly using command{' '}
                  <Definition>dvc config NAME VALUE</Definition>.{' '}
                </li>

                <li>
                  <Definition>.dvc/cache</Definition> - the cache directory will
                  contain your data files (the data directories of DVC
                  repositories will only contain hardlinks to the data files in
                  the global cache).
                </li>

                <li>
                  <Note>
                    Note: DVC includes the cache directory to{' '}
                    <Definition>.gitignore</Definition>
                    file during the initialization. And no data files (with
                    actual content) will ever be pushed to Git repository, only
                    dvc-files are needed to reproduce them.
                  </Note>
                </li>

                <li>
                  <Definition>.dvc/state</Definition> - this file is created for
                  optimization. The file contains data files checksum,
                  timestamps, inodes, etc.
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="configuration_cloud" small>
              Working with Cloud Data Storages
            </PartTitle>
            <Paragraph>
              Using DVC with Cloud-based data storage is optional. By default,
              DVC is configured to use a local data storage only (.dvc/cache
              directory), which enables basic DVC usage scenarios out of the
              box. DVC can use cloud storage as a common file storage. With
              cloud storage, you might use models and data files which were
              created by your team members without spending time and resources
              to re-build models and re-process data files. As of this version,
              DVC supports two types of cloud-based storage providers:
              <ul>
                <li>
                  <Definition>AWS</Definition> - Amazon Web Services
                </li>
                <li>
                  <Definition>GCP</Definition> - Google Cloud Platform The
                  subsections below explain how to configure DVC to use each of
                  them. Using AWS
                </li>
              </ul>
            </Paragraph>
            <Paragraph>
              To use AWS as cloud storage for your DVC repositories, you should
              update these <Definition>.dvc/config</Definition> options
              <ul>
                <li>
                  <Definition>Cloud = AWS</Definition> in{' '}
                  <Definition>Global</Definition> section.
                </li>

                <li>
                  <Definition>
                    StoragePath = /mybucket/dvc/tag_classifier
                  </Definition>{' '}
                  in <Definition>AWS</Definition>
                  section - path to a cloud storage bucket and directory in the
                  bucket.
                </li>

                <li>
                  <Definition>CredentialPath = ~/aws/credentials</Definition> in{' '}
                  <Definition>AWS</Definition> section - path to AWS credentials
                  in your local machine (AWS cli command line tools creates this
                  directory). In Mac, default value is
                  <Definition>~/.aws/credentials</Definition>, and it is{' '}
                  <Definition>%USERPATH%/.aws/credentials</Definition>
                  in Windows <Definition>Important:</Definition> do not forget
                  to commit the config file change to Git:{' '}
                  <Definition>git commit -am "Change cloud to AWS"</Definition>
                  Instead of manual file modification, we recommend you run the
                  following commands:
                </li>
              </ul>
            </Paragraph>
            <Code
              source={`	$ dvc config Global.Cloud AWS # This step is not needed for new DVC repositories
	$ dvc config AWS.StoragePath /mybucket/dvc/tag_classifier
	$ dvc config AWS.CredentialPath ~/.aws/credentials # Not needed if AWS CLI is installed to default path
	$ dvc config AWS.CredentialSection default # Not needed if you have only one AWS account
	$ git commit -am "Change cloud to AWS"
`}
            />
            <Paragraph>
              <h4>Using Google Cloud </h4>
              For using GCP (Google Cloud Platform) as cloud storage for your
              DVC repositories, you should update these{' '}
              <Definition>.dvc/config</Definition> options
              <ul>
                <li>
                  <Definition>Cloud = GCP</Definition> in{' '}
                  <Definition>Global</Definition> section.
                </li>

                <li>
                  <Definition>
                    StoragePath = /mybucket/dvc/tag_classifier
                  </Definition>{' '}
                  in GCP section - Run{' '}
                  <Definition>
                    dvc config GCP.StoragePath /my/path/to/a/bucket
                  </Definition>
                </li>
                <li>
                  <Definition>ProjectName = MyCloud</Definition> - a GCP
                  specific project name.
                  <Definition>Important:</Definition> do not forget to commit
                  the config file change to Git:{' '}
                  <Definition>git commit -am "Change cloud to GCP"</Definition>{' '}
                  Instead of manual file modification, we recommend you run the
                  following commands::
                </li>
              </ul>
              <Code
                source={`	$ dvc config Global.Cloud GCP
	$ dvc config GCP.StoragePath /mybucket/dvc/tag_classifier
	$ dvc config GCP.ProjectName MyCloud
	$ git commit -am "Change cloud to AWS"
`}
              />
            </Paragraph>
            {/**/}
            <PartTitle name="commands">Using DVC Commands</PartTitle>
            <Paragraph>
              DVC is a command-line tool. The typical use case for DVC goes as
              follows
            </Paragraph>
            <Paragraph>
              <ul>
                <li>
                  {' '}
                  In an existing Git repository, initialize a DVC repository
                  with <Definition>dvc init</Definition>.{' '}
                </li>
                <li>
                  Copy source files for modeling into the repository and convert
                  the files into DVC data files with{' '}
                  <Definition>dvc add </Definition>
                  command.
                </li>

                <li>
                  {' '}
                  Process source data files through your data processing and
                  modeling code using the <Definition>dvc run</Definition>{' '}
                  command.{' '}
                </li>

                <li>
                  {' '}
                  Use <Definition>--outs</Definition> option to specify{' '}
                  <Definition>dvc run</Definition> command outputs which will be
                  converted to DVC data files after the code runs.{' '}
                </li>

                <li>
                  Clone a git repo with the code of your ML application
                  pipeline. However, this will not copy your DVC cache. Use
                  cloud storage settings and <Definition>dvc push</Definition>{' '}
                  to share the cache (data).
                </li>

                <li>
                  Use <Definition>dvc repro</Definition> to quickly reproduce
                  your pipeline on a new iteration, after your data item files
                  or source code of your ML application are modified.
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="commands_cheat_sheet" small>
              DVC Commands Cheat Sheet
            </PartTitle>
            <Paragraph>
              Below is the quick summary of the most important commands
              <ul>
                <li>
                  <Definition>dvc -h</Definition> - Show how to use DVC and show
                  the list of commands.{' '}
                </li>

                <li>
                  <Definition>dvc CMD -h</Definition> - Display help to use a
                  specific DVC command (CMD).{' '}
                </li>

                <li>
                  <Definition>dvc init</Definition> - Initialize a new DVC
                  repository.{' '}
                </li>

                <li>
                  <Definition>dvc add</Definition> - Add data file or data
                  directory. The command converts regular files to DVC data
                  files.
                </li>

                <li>
                  <Definition>dvc checkout</Definition> - Checkout data files
                  and dirs into the working tree. The command should be executed
                  after <Definition>git checkout</Definition> or cloning a
                  repository.
                </li>

                <li>
                  <Definition>dvc run</Definition> - Generate a DVC file from a
                  given command and execute the command. The command
                  dependencies and outputs should be specified.
                </li>

                <li>
                  <Definition>dvc pull</Definition> - Pull data files from the
                  cloud. Cloud settings for your DVC environment should be
                  already configured prior to using this command.
                </li>

                <li>
                  <Definition>dvc push</Definition> - Push data files to the
                  cloud. Cloud settings should be already configured.
                </li>

                <li>
                  <Definition>dvc status</Definition> - Show status of a data
                  file in the DVC repository.
                </li>

                <li>
                  <Definition>dvc repro</Definition> - Reproduce a stage of
                  pipeline. Default stage file is{' '}
                  <Definition>Dvcfile</Definition>.
                </li>

                <li>
                  <Definition>dvc remove</Definition> - Remove data file (files
                  or/and folders).
                </li>

                <li>
                  <Definition>dvc gc</Definition> - Collect garbage by cleaning
                  DVC cache.
                </li>

                <li>
                  <Definition>dvc config</Definition> - Get or set configuration
                  settings (as specified in dvc.conf).
                </li>

                <li>
                  <Definition>dvc show</Definition> - Show graphs.
                </li>

                <li>
                  <Definition>dvc fsck</Definition>- Data file consistency
                  check.
                </li>
              </ul>
            </Paragraph>
            <PartTitle name="commands_command_reference">
              DVC Command Reference
            </PartTitle>
            <PartTitle name="commands_command_reference_init" small>
              init
            </PartTitle>
            <Paragraph>
              This command initializes a DVC environment in a current Git
              repository.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
   :linenos:

	usage: dvc init [-h] [-q] [-v]
	optional arguments:
	  -h, --help     show this help message and exit
	  -q, --quiet    Be quiet.
	  -v, --verbose  Be verbose.
`}
            />
            <Paragraph>
              Example. Creating a new DVC repository:
              <Code
                source={`	$ mkdir tag_classifier
	$ cd tag_classifier

	$ git init
	Initialized empty Git repository in /Users/dmitry/src/tag_classifier/.git/

	$ dvc init
	$ git status
	On branch master

	Initial commit

	Changes to be committed:

	  (use "git rm --cached <file>..." to unstage)

	        new file:   .dvc/.gitignore
	        new file:   .dvc/config

	$ git commit -m 'Init DVC'
	[master (root-commit) 2db4618] Init DVC
	 2 files changed, 41 insertions(+)
	 create mode 100644 .dvc/.gitignore
	 create mode 100644 .dvc/config
`}
              />
            </Paragraph>
            <PartTitle name="commands_command_reference_add" small>
              add
            </PartTitle>
            <Paragraph>
              Converts files and directories to DVC data files. The command does
              the conversion from a <Definition>regular file</Definition> to{' '}
              <Definition>DVC data file</Definition> in a few steps:
              <ul>
                <li>Calculate the file checksum.</li>
                <li>
                  Create a cache file in the cache dir{' '}
                  <Definition>.dvc/cache</Definition>.
                </li>
                <li>Create a corresponding DVC file.</li>
                <li>
                  Replace the file with a hardlink to the cache file. DVC stores
                  the file's last modification timestamp, inode, and the
                  checksum into a global state file{' '}
                  <Definition>.dvc/state</Definition> to reduce time recomputing
                  checksums later. Note, this command does NOT copy any file
                  contents and will run quickly even for a large files. Step (2)
                  from the above is also made by hardlinks movement, not file
                  content. The only heavy step is (1), which requires checksum
                  calculation. For directories, the command does the same steps
                  for each file recursively. To retain information about the
                  directory structure, a corresponding directory will be created
                  in
                  <Definition>.dvc/cache</Definition>.
                </li>
              </ul>
            </Paragraph>
            <Code
              source={`.. code-block:: shell
   :linenos:

	usage: dvc add [-h] [-q] [-v] targets [targets ...]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
`}
            />
            <Paragraph>Examples: Convert files into data files::</Paragraph>
            <Code
              source={`	$ mkdir raw
	$ cp ~/Downloads/dataset/* raw
	$ ls raw
	Badges.xml          PostLinks.xml           Votes.xml
	$ dvc add raw/Badges.tsv raw/PostLinks.tsv raw/Votes.tsv
	$ ls raw
	Badges.xml          PostLinks.xml           Votes.xml
	Badges.xml.dvc      PostLinks.xml.dvc       Votes.xml.dvc
`}
            />
            <Paragraph>Note, DVC files are created.</Paragraph>
            {/*

            */}
            <PartTitle name="commands_command_reference_checkout" small>
              checkout
            </PartTitle>
            <Paragraph>
              Checkout data files from cache. This command has to be called
              after <Definition>git checkout</Definition> since Git does not
              handle DVC data files. The command restores data files from cache
              to the working tree and removes data files that are no longer on
              the working tree. Note, this command does NOT copy any files
              <Note>
                DVC uses hardlinks to perform data file restoration. This is
                crucial for large files where checking out as a 50Gb file might
                take a few minutes. For DVC, it will take less than a second to
                restore a 50Gb data file.
              </Note>
            </Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	usage: dvc checkout [-h] [-q] [-v]

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
`}
            />
            <Paragraph>Examples. Checking out a branch example::</Paragraph>
            <Code
              source={`	$ git checkout input_100K
	$ dvc checkout
	$ Remove 'data/model.p'
	$ Remove 'data/matrix-train.p'
	$ 'data/Posts-train.tsv': cache file not found
`}
            />
            <Paragraph>
              DVC does not report in the output which data files were restored.
              However, it reports removed files and files that DVC was unable to
              restore due to missing cache. To restore a file with a missing
              cache, the reproduction command should be called or the cache can
              be pulled from the cloud. It might be convenient to assign Git
              hook to <Definition>git checkout</Definition>:
            </Paragraph>
            <Code
              source={`	$ echo 'dvc checkout' > .git/hooks/post-checkout
	$ chmod +x .git/hooks/post-checkout
	$ git checkout input_100K  # dvc checkout is not needed anymore
	$ Remove 'data/model.p'
	$ Remove 'data/matrix-train.p'
	$ 'data/Posts-train.tsv': cache file not found
`}
            />
            {/*
            */}
            <PartTitle name="commands_command_reference_run" small>
              run
            </PartTitle>
            <Paragraph>
              Generate a stage file from a given command and execute the
              command. The command dependencies and outputs should be specified.
              By default, stage file name is{' '}
              <Definition>{'<file>.dvc'}</Definition> where{' '}
              <Definition>{'<file>'}</Definition> is file name of the first
              output. For example, launch Python with a given python script and
              arguments. Or R script by Rscript command.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
   :linenos:

	usage: dvc run [-h] [-q] [-v] [-d DEPS] [-o OUTS] [-O OUTS_NO_CACHE] [-f FILE]
	               [-c CWD] [--no-exec]
	               ...

	positional arguments:
	  command               Command or command file to execute

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -d DEPS, --deps DEPS  Declare dependencies for reproducible cmd.
	  -o OUTS, --outs OUTS  Declare output data file or data directory.
	  -O OUTS_NO_CACHE, --outs-no-cache OUTS_NO_CACHE
	                        Declare output regular file or directory (sync to Git,
	                        not DVC cache).
	  -f FILE, --file FILE  Specify name of the state file
	  -c CWD, --cwd CWD     Directory to run your command and place state file in
	  --no-exec             Only create stage file without actually running it
`}
            />
            <Paragraph>
              Examples: Execute a Python script as the DVC pipeline step. Stage
              file was not specified, so a <Definition>model.p.dvc</Definition>{' '}
              stage file will be created::
            </Paragraph>
            <Code
              source={`	$ # Train ML model on the training dataset. 20180226 is a seed value.
	$ dvc run -d matrix-train.p -d train_model.py -o model.p python train_model.py matrix-train.p 20180226 model.p
`}
            />
            <Paragraph>
              Execute an R script as the DVC pipeline step::
            </Paragraph>
            <Code
              source={`	$ dvc run -d parsingxml.R -d Posts.xml -o Posts.csv Rscript parsingxml.R Posts.xml Posts.csv
`}
            />
            <Paragraph>
              Extract an XML file from an archive to the data/ subfolder::
            </Paragraph>
            <Code
              source={`	$ mkdir data
	$ dvc run -d Posts.xml.tgz -o data/Posts.xml tar zxf Posts.xml.tgz -C data/
`}
            />
            <PartTitle name="commands_command_reference_push" small>
              push
            </PartTitle>
            <Paragraph>
              This command pushes all data file caches related to the current
              Git branch to cloud storage. Cloud storage settings need to be
              configured. See cloud storage configuration for more details on
              how to set up cloud storage.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
   :linenos:

	usage: dvc push [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
`}
            />
            <Paragraph>
              Examples: Push all data file caches from the current Git branch to
              cloud::
            </Paragraph>
            <Code
              source={`	$ dvc push
	(1/8): [########################################] 100% 72271bebdf053178a5cce48b4
	(2/8): [########################################] 100% d7208b910d1a40fedc2da5a44
	(3/8): [########################################] 100% 7f6ed2919af9c9e94c32ea13d
	(4/8): [########################################] 100% 5988519f8465218abb23ce0e0
	(5/8): [########################################] 100% 11de13709a78379d253a3d0f5
	(6/8): [########################################] 100% 3f9c7c3ae51db2eed7ba99e6e
	(7/8): [########################################] 100% cfdaa4bba57fa07d81ff96685
	(8/8): [#######################                 ] 57% 1de6178a9dd844e249ba05414
`}
            />
            {/*

            */}
            <PartTitle name="commands_command_reference_pull" small>
              pull
            </PartTitle>
            <Paragraph>
              This command pulls all data file caches from cloud storage. Cloud
              storage settings need to be configured.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
   :linenos:

	usage: dvc pull [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
`}
            />
            <Paragraph>
              Examples: Pull all files from the current Git branch::
            </Paragraph>
            <Code
              source={`	$ dvc pull
	(1/8): [########################################] 100% 54a6f1787490ba13fb811a46b
	(2/8): [########################################] 100% 5806dc797c08fb6ddd5d97d46
	(3/8): [########################################] 100% 5988519f8465218abb23ce0e0
	(4/8): [########################################] 100% 7f6ed2919af9c9e94c32ea13d
	(5/8): [########################################] 100% 11de13709a78379d253a3d0f5
	(6/8): [########################################] 100% c6f5a256d628e144db4181de8
	(7/8): [########################################] 100% 3f9c7c3ae51db2eed7ba99e6e
	(8/8): [########################################] 100% cfdaa4bba57fa07d81ff96685
`}
            />
            <PartTitle name="commands_command_reference_status" small>
              status
            </PartTitle>
            <Paragraph>
              Show mismatches between local cache and cloud cache.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	usage: dvc status [-h] [-q] [-v] [-j JOBS]

	optional arguments:
	  -h, --help            show this help message and exit
	  -q, --quiet           Be quiet.
	  -v, --verbose         Be verbose.
	  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.

`}
            />
            <Paragraph>Examples: Show statuses::</Paragraph>
            <Code
              source={`	$ dvc status
	        new file:   /Users/dmitry/src/myrepo_1/.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9
`}
            />
            <PartTitle name="commands_command_reference_repro" small>
              repro
            </PartTitle>
            <Paragraph>
              Reproduce DVC file and all stages the file depends on
              (recursively). Default file name is{' '}
              <Definition>Dvcfile</Definition>. However, DVC files can have any
              name followed by the <Definition>.dvc</Definition> suffix.
            </Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	usage: dvc repro [-h] [-q] [-v] [-f] [-s] [targets [targets ...]]

	positional arguments:
		target                DVC file to reproduce.

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-f, --force           Reproduce even if dependencies were not changed.
		-s, --single-item     Reproduce only single data item without recursive dependencies check.

 `}
            />
            <Paragraph>Examples: Reproduce default stage file::</Paragraph>
            <Code
              source={`	$ dvc repro
	Verifying data sources in 'data/Posts.xml.tgz.dvc'
	Reproducing 'Posts.xml.dvc':
	        tar zxf data/Posts.xml.tgz -C data/
	Reproducing 'Posts.tsv.dvc':
	        python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
	Reproducing 'Posts-train.tsv.dvc':
	        python code/split_train_test.py data/Posts.tsv 0.33 20170426 data/Posts-train.tsv data/Posts-test.tsv
	Reproducing 'matrix-train.p.dvc':
	        python code/featurization.py data/Posts-train.tsv data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
	Reproducing 'model.p.dvc':
	        python code/train_model.py data/matrix-train.p 20170426 data/model.p

Reproduce the part of the pipeline where *Posts.tsv.dvc* is the target DVC file::

	$ dvc repro Posts.tsv.dvc
	Reproducing 'Posts.xml.dvc':
	        tar zxf data/Posts.xml.tgz -C data/
	Reproducing 'Posts.tsv.dvc':
	        python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
`}
            />
            {/*


            */}
            <PartTitle name="commands_command_reference_remove" small>
              remove
            </PartTitle>
            <Paragraph>Remove data file or data directory.</Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	usage: dvc remove [-h] [-q] [-v] targets [targets ...]

	positional arguments:
		targets               Target to remove - file or directory.

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
`}
            />
            <Paragraph>
              Examples: Remove <Definition>matrix-train.p</Definition> data
              file::
            </Paragraph>
            <Code source={`	$ dvc remove matrix-train.p`} />
            {/*

            */}
            <PartTitle name="commands_command_reference_gc" small>
              gc
            </PartTitle>
            <Paragraph>
              This command collects the garbage, removing unused cache files
              based on the current Git branch. If a data file was created in a
              different branch, then it will be removed by gc. If a data file
              has a few versions (and, of course. corresponding caches) - all
              caches except the current one will be removed.
              <Code
                source={`.. code-block:: shell
	:linenos:

	age: dvc gc [-h] [-q] [-v]

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
`}
              />
            </Paragraph>
            <Paragraph>
              Clean up example::
              <Code
                source={`	$ du -sh .dvc/cache/
	7.4G    .dvc/cache/
	$ dvc gc
	'.dvc/cache/27e30965256ed4d3e71c2bf0c4caad2e' was removed
	'.dvc/cache/2e006be822767e8ba5d73ebad49ef082' was removed
	'.dvc/cache/2f412200dc53fb97dcac0353b609d199' was removed
	'.dvc/cache/541025db4da02fcab715ca2c2c8f4c19' was removed
	'.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9' was removed
	'.dvc/cache/7c4521365288d69a03fa22ad3d399f32' was removed
	'.dvc/cache/9ff7365a8256766be8c363fac47fc0d4' was removed
	'.dvc/cache/a86ca87250ed8e54a9e2e8d6d34c252e' was removed
	'.dvc/cache/f64d65d4ccef9ff9d37ea4cf70b18700' was removed
	$ du -sh .dvc/cache/
	3.1G    .dvc/cache/
`}
              />
            </Paragraph>
            {/*

            */}
            <PartTitle name="commands_command_reference_config" small>
              config
            </PartTitle>
            <Paragraph>
              Get or set config options. This command reads and overwrites the
              DVC config file <Definition>{'.dvc/config'}</Definition>.
              <Code
                source={`.. code-block:: shell
	:linenos:

	usage: dvc config [-h] [-q] [-v] [-u] name [value]

	positional arguments:
		name                  Option name
		value                 Option value

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-u, --unset           Unset option
`}
              />
            </Paragraph>
            <Paragraph>
              Examples: Specify an option name to get the option's value from
              config file::
              <Code
                source={`	$ dvc config config Global.Cloud
	AWS
`}
              />
            </Paragraph>
            {/**/}
            <Paragraph>
              Overwrite the value::
              <Code
                source={`	$ dvc config Global.Cloud GCP
	$ git add .dvc/config
	$ git commit -m 'Change cloud to GCP'
	[input_100K a4c985f] Change cloud to GCP
	 1 file changed, 1 insertion(+), 1 deletion(-)
`}
              />
            </Paragraph>
            {/**/}
            <PartTitle name="commands_command_reference_show" small>
              show
            </PartTitle>
            <Paragraph>
              Generate pipeline image for your current project.
              <Code
                source={`.. code-block:: shell
	:linenos:

	usage: dvc show [-h] [-q] [-v] {pipeline} ...

	positional arguments:
		{pipeline}     Use \`dvc show CMD\` --help for command-specific help
		pipeline              Show pipeline image

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
`}
              />
            </Paragraph>
            <Paragraph>
              Examples: Show the pipeline image::
              <Code
                source={`	$ dvc show pipeline
`}
              />
            </Paragraph>
            {/**/}
            <PartTitle name="commands_command_reference_fsck" small>
              fsck
            </PartTitle>
            <Paragraph>
              Data file consistency check. By default the commands outputs
              statuses of all corrupted data files (if any). Use{' '}
              <Definition>--all</Definition> option to see statuses of all data
              files. The command checks:
              <ul>
                <li>
                  Cache file name which is equal to the file content checksum
                  when DVC created the file.
                </li>

                <li>Checksum from local state file.</li>

                <li>Checksum regarding DVC files.</li>

                <li>
                  The actual recomputed checksum. This is a computation heavy
                  command for large data files. Enabled only by{' '}
                  <Definition>--physical</Definition>
                  option. Data file is considered to be corrupted if one of the
                  checksums does not match all others.
                </li>
              </ul>
            </Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	dvc fsck [-h] [-q] [-v] [-p] [-a] [targets [targets ...]]

	positional arguments:
		targets               Data files to check

	optional arguments:
		-h, --help            show this help message and exit
		-q, --quiet           Be quiet.
		-v, --verbose         Be verbose.
		-p, --physical        Compute actual md5
		-a, --all             Show all data files including correct ones
`}
            />
            <Paragraph>
              Examples. Check list of corrupted data files::
              <Code
                source={`	\\$ dvc fsck --physical
	File data/matrix-test.p:
	    Error status:           Checksum missmatch!!!
	    Actual checksum:        7c4521365288d69a03fa22ad3d399f32
	    Cache file name:        7c4521365288d69a03fa22ad3d399f32
	    Local state checksum:   7c4521365288d69a03fa22ad3d399f32
	    Local state mtime:      1517048086.0
	    Actual mtime:           1517048086.0
	    Stage file: eval_auc.txt.dvc
	        Checksum:           7c4521365288d69a03fa22ad3d399f32
	        Type:               Dependency
	    Stage file: matrix-train.p.dvc
	        Checksum:           7c4521365288d69a03fa22ad3d399f32
	        Type:               Output
	        Use cache:          true
`}
              />
            </Paragraph>
            {/**/}
            <PartTitle name="common_arguments">Common Arguments</PartTitle>
            <PartTitle name="common_arguments_options" small>
              Common Options
            </PartTitle>
            <Paragraph>
              As you can see, there are four optional arguments that are
              applicable to any DVC command. They are
            </Paragraph>
            <Code
              source={`.. code-block:: shell
	:linenos:

	-h, --help            show this help message and exit
	-q, --quiet           Be quiet.
	-v, --verbose         Be verbose.
`}
            />
            <Paragraph>
              Although these optional arguments are pretty self-explanatory,
              there is a note for DVC and Git commands that are used together.
              <ul>
                <li>
                  To see Git commands in DVC, you can set logging level to{' '}
                  <Definition>Debug</Definition>
                  (in <Definition>dvc.conf</Definition>) or run dvc with option{' '}
                  <Definition>--verbose</Definition>
                </li>
              </ul>
            </Paragraph>
            {/**/}
            <PartTitle name="common_arguments_number_of_dvc_jobs" small>
              {' '}
              Number of DVC Jobs
            </PartTitle>
            <Paragraph>
              DVC can benefit from parallel processing and multiple
              processors/cores when performing cache push/pull operations.
            </Paragraph>
            <Paragraph>
              By default, the number of DVC jobs is set to the number of
              available CPU cores. If you would like to change it to any other
              reasonable value, you could use{' '}
              <Definition>-j (--jobs)</Definition> option in DVC commands where
              applicable.
            </Paragraph>
          </Parts>
          {/* /Content */}
        </Inner>
      </Content>
    </Container>
  </Page>
)

const Container = styled.div`
  margin-top: 93px;
  display: flex;
  flex-direction: row;
  min-height: 80vh;

  ${media.phablet`
    margin-top: 63px;
    flex-direction: column;
  `} @media only screen and (orientation: landscape) {
    margin-top: 63px;
    flex-direction: column;
  }
`

const Side = styled.div`
  flex-basis: 35.7%;
  display: flex;
  justify-content: flex-end;
  background-color: #eef4f8;
  padding-top: 32px;
  padding-rigth: 42px;

  ${media.phablet`
    flex-basis: auto;
    flex: 1;
  `} @media only screen and (orientation: landscape) {
    flex-basis: auto;
    flex: 1;
  }
`

const Menu = styled.div`
  max-width: 280px;
  margin-right: 18px;

  ${media.phablet`
    padding: 30px;
    width: 100%;
    max-width: none;
    margin-right: 0px;
  `} @media only screen and (orientation: landscape) {
    padding: 30px;
    width: 100%;
    max-width: none;
    margin-right: 0px;
  }
`

const Heading = styled.h3`
  font-size: 24px;
  color: #b0b8c5;
`

const SearchArea = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  min-width: 280px;
  height: 44px;
`

const Content = styled.article`
  flex: 1;

  padding-top: 69px;
  padding-left: 62px;

  ${media.phablet`
    padding: 30px;
  `};
`

const Inner = styled.div`
  max-width: 615px;

  ${media.phablet`
    max-width: auto;
  `} @media only screen and (orientation: landscape) {
    max-width: auto;
  }

  color: #5f6c72;
  font-size: 18px;
  line-height: 1.5;
`

const TutorialLink = styled.a`
  font-size: 18px;
  color: #945dd6;

  padding-right: 26px;
  background: url('/static/img/link.svg') no-repeat center right;

  &:hover,
  &:visited {
    color: #945dd6;
  }
`

const Sections = styled.div`
  margin-bottom: 40px;
`

const SectionLinks = styled.div`
  @media (max-width: 768px) {
    position: relative;
  }
`

const SectionLink = styled.a`
  display: block;
  position: relative;
  font-size: 18px;
  font-weight: 500;
  color: #b0b8c5;
  text-decoration: none;

  line-height: 26px;
  min-height: 26px;
  margin-bottom: 5px;

  &:hover {
    color: #3c3937;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 4.7px;
    background: url('/static/img/triangle.svg') no-repeat center center;
    left: 0px;
    top: 10px;
  }

  ${props =>
    props.level === 1 &&
    `
    padding-left: 14px;
  `} ${props =>
    props.level === 2 &&
    `
      padding-left: 44px;
      
      &::before {
        display: none;
      }
  `};

  ${props =>
    props.underlined &&
    `
	  font-weight: bold;
	`};
`

const Parts = styled.article`
  > ul,
  > ol {
    padding-left: 1em;
  }
`

const SubSectionTitle = styled.h4`
  font-weight: normal;
`

const CodeBlock = styled(SyntaxHighlighter)`
  font-family: monospace, monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #fcf6f0 !important;
  border-radius: 12px;
  padding: 2em 2em;
  background-color: hsla(0, 0%, 0%, 0.04);

  code {
    font-family: Space Mono, SFMono-Regular, Menlo, Monaco, Consolas,
      Liberation Mono, Courier New, monospace;
    padding: 0;
    background: #fcf6f0;
    font-size: 80%;
    font-variant: none;
    -webkit-font-feature-settings: 'clig' 0, 'calt' 0;
    font-feature-settings: 'clig' 0, 'calt' 0;
  }
`

const Definition = styled.b`
  color: #40364d;
  font-weight: bold;
`

const Line = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin-top: 20px;
  margin-bottom: 20px;
`

const Paragraph = styled.p`
  margin: 22px 0px;
  font-size: 18px;
  color: #5f6c72;
  line-height: 1.5;

  * {
    color: #5f6c72;
    font-size: 18px;
    line-height: 1.5;
  }

  a {
    color: #1b72df;
  }

  ${props =>
    props.inline &&
    `
    margin: 0px;
  `} ul, ol {
    padding-left: 46px;
    margin: 18px 0px;

    li {
      margin: 1em 0px;
    }

    p {
      margin: 12px 0px;
    }
  }

  ul {
    list-style: disc;
  }
`

const Note = Paragraph.extend`
  color: #333;
`

const PartTitleLink = styled.a`
  padding-top: 18px;
  color: rgb(27, 27, 27);
  text-decoration: none;

  display: block;
  margin-top: 18px;
  margin-bottom: 18px;
  border-top: 1px solid #f0f0f0;

  ${props =>
    props.noline &&
    `
    margin-top: 0px;
    margin-bottom: 0px;
    border-top: none;
  `};
`

const SubHeading = styled.h2`
  font-size: 30px;
  margin-bottom: 5px;
  color: #40364d;

  ${props =>
    props.small &&
    `
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 20px;
  `};

  a {
    text-decoration: none;
    color: rgb(27, 27, 27);
  }
`

const OnlyDesktop = styled.div`
  display: initial;
  ${media.giant`display: initial;`};
  ${media.desktop`display: initial;`};
  ${media.tablet`display: initial;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`
