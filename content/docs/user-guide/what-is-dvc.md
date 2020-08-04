# What Is DVC?

**Data Version Control** is a new type of data versioning, workflow and
experiment management software, that builds upon [Git](https://git-scm.com/)
(although it can work stand-alone). DVC reduces the gap between established
engineering tool sets and data science needs, allowing users to take advantage
of [new features](#core-features) while reusing existing skills and intuition.

![](/img/reproducibility.png) _DVC codifies data and ML experiments_

Data science experiment sharing and collaboration can be done through regular
Git flows (commits, branching, pull requests, etc.), the same way it works for
software engineers.

[`dvc`](/doc/command-reference) is a command line tool, similar to `git`.

## Core Features

- DVC works **on top of Git repositories** and has a similar command line
  interface and flow as Git. DVC can also work stand-alone, but without
  versioning capabilities.

- **Large [data file](/doc/user-guide/basic-concepts#data-files) tracking** is
  enabled, by creating special files that point to the original data (in the
  <abbr>cache</abbr>). These can be easily versioned with Git.

- DVC makes data science projects **reproducible** by creating lightweight
  [pipelines](/doc/user-guide/basic-concepts#data-pipelines), using implicit
  dependency graphs.

- DVC is **platform agnostic**: It runs on all major operating systems (Linux,
  MacOS, and Windows), and works independently of the programming languages
  (Python, R, Julia, shell scripts, etc.) or ML libraries (Keras, Tensorflow,
  PyTorch, Scipy, etc.) used in the <abbr>project</abbr>.

- **Open-source** and **Self-serve**: DVC is
  [free](https://github.com/iterative/dvc/blob/master/LICENSE) and doesn't
  require any additional servers or services.

  > Git servers, as well as SSH and cloud storage providers are supported,
  > however.

- **Cloud storage**: Available addon to the core DVC features. Multiple
  providers are supported (Amazon S3, Microsoft Azure Blob Storage, Google Cloud
  Storage, etc.). This is how a data scientist transfers large data files or
  shares a GPU-trained model with others. Implemented as
  [remote storage](/doc/command-reference/remote).

  > This complement is separate from DVC itself, and never required.
