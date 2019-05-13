# Tools for Data Scientists

## Existing engineering tools

There is one common opinion regarding data science tooling. Data scientists as
engineers are supposed to use the best practices and collaboration software from
software engineering. Source code version control system (Git), continuous
integration services (CI), and unit test frameworks are all expected to be
utilized in the data science pipeline.

But a comprehensive look at data science processes shows that the software
engineering toolset does not cover data science needs. Try to answer all the
questions from the above using only engineering tools, and you are likely to be
left wanting for more.

## Experiment management software

To solve data scientists collaboration issues a new type of software was
created - **experiment management software**. This software aims to cover the
gap between data scientist needs and the existing toolset.

The experimentation software is usually **user interface (UI) based in contrast
to the existing command line engineering tools**. The UI is a bridge to a
**separate cloud based environment**. The cloud environment is usually not so
flexible as local data scientists environment. And the cloud environment is not
fully integrated with the local environment.

The separation of the local data scientist environment and the experimentation
cloud environment creates another discrepancy issue and the environment
synchronization requires addition work. Also, this style of software usually
require external services, typically accompanied with a monthly bill. This might
be a good solution for a particular companies or groups of data scientists.
However a more accessible, free tool is needed for a wider audience.
