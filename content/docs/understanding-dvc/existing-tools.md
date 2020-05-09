# Tools for Data Scientists

## Existing engineering tools

There is one thing that data scientists seem to agree on around tooling: as
engineers, we'd like to use the same best practices and collaboration software
that's standard in software engineering. A source code version control system
(Git), continuous integration services (CI), and unit test frameworks are all
expected to be utilized in data science
[pipelines](/doc/command-reference/pipeline).

But a comprehensive look at data science processes shows that the software
engineering toolset does not completely cover data science needs. Try to answer
all the questions from the above using only engineering tools, and you're likely
to be left wanting more.

## Experiment management software

This new type of software was created to solve data science collaboration
issues. Experiment management software aims to cover the gap between data
scientist needs and the existing toolset from software engineering.

Experiment management software is usually **graphical user interface** (GUI)
based, in contrast to existing command line engineering tools. The GUI is a
bridge to a separate **cloud based environment**. The cloud environment is
usually not as flexible as local data scientist environments, and isn't fully
integrated with local environments either.

The separation of the local data scientist environment and the experimentation
cloud environment creates another discrepancy issue, and environment
synchronization requires addition work. Also, this style of software usually
requires external services that aren't free. This might be a good solution for a
particular companies or groups of data scientists. but a more accessible, free
tool is needed for a wider audience.
