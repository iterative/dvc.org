# Core Features

- DVC works **on top of Git repositories** and has a similar command line
  interface and Git workflow.

- It makes data science projects **reproducible** by creating lightweight
  [pipelines](/doc/command-reference/dag) using implicit dependency graphs.

- **Large data file versioning** works by creating special files in your Git
  repository that point to the <abbr>cache</abbr>, typically stored on a local
  hard drive.

- DVC is **Programming language agnostic**: Python, R, Julia, shell scripts,
  etc. as well as ML library agnostic: Keras, Tensorflow, PyTorch, Scipy, etc.

- It's **Open-source** and **Self-serve**: DVC is free and doesn't require any
  additional services.

- DVC supports cloud storage (Amazon S3, Microsoft Azure Blob Storage, Google
  Cloud Storage, etc.) for **data sources and pre-trained model sharing**.
