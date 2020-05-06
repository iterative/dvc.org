---
title: DVC project ideas for Google Season of Docs 2019
date: 2019-04-23
description: |
  DVC.org is applying for Google Season of Docs — a new and unique program
  sponsored by Google that pairs technical writers with open source projects to
  collaborate on the open source project documentation.
descriptionLong: |
  [DVC.org](https://dvc.org) is applying for
  [Google Season of Docs](https://developers.google.com/season-of-docs/) — a new
  and unique program sponsored by Google that pairs technical writers with open source projects to
  collaborate on the open source project documentation.

  It’s happening for the first time in 2019 and we are excited about the
  opportunity to be a part of it!
picture: 2019-04-23/post-image.png
author: svetlana_grinchenko
commentsUrl: https://discuss.dvc.org/t/dvc-project-ideas-for-google-season-of-docs-2019/291
tags:
  - Google Season of Docs
  - Python
  - Documentation
---

We strongly believe that well-shaped documentation is key for making the product
truly open. We have been investing lots of time and energy in improving our docs
lately. Being a team of 90% engineers we are eager to welcome the writers into
our team and our community. We are happy to share our experience, introduce them
to the world of open source and machine learning best practices, guide through
the OS contribution process and work together on improving our documentation.

DVC was started in late 2017 by a data scientist and an engineer. It is now
growing pretty fast and though our in-house team is quite small, we have to
thank our contributors (more than 80 in both code and docs) for developing DVC
with us. When working with DVC the technical writer will not only get lots of
hands-on experience in writing technical docs, but will also immerse into DVC
community — a warm and welcoming gathering of ML and DS enthusiasts and an
invaluable source of inspiration and expertise in ML engineering.

### About DVC

DVC is a brainchild of a data scientist and an engineer, that was created to
fill in the gaps in the ML processes tooling and evolved into a successful open
source project.

ML brings changes in development and research processes. These ML processes
require new tools for data versioning, ML pipeline versioning, resource
management for model training and others that haven’t been formalized. The
traditional software development tools do not fully cover ML team’s needs but
there are no good alternatives. It makes engineers to custom develop a new
toolset to manage data files, keep track of ML experiments and connect data and
source code together. The ML process becomes very fragile and requires tons of
tribal knowledge.

We have been working on [DVC](http://DVC.org) by adopting best ML practices and
turning them into Git-like command line tool. DVC versions multi-gigabyte
datasets and ML models, make them shareable and reproducible. The tool helps to
organize a more rigorous process around datasets and the data derivatives. Your
favorite cloud storage (S3, GCS, or bare metal SSH server) could be used with
DVC as a data file backend.

If you are interested in learning a little bit more about DVC and its journey,
here is a great interview with DVC creator in the Episode 206 of
Podcast.**init**. Listen to it
[HERE ](https://www.pythonpodcast.com/data-version-control-episode-206/)or read
the transcript
[HERE.](https://towardsdatascience.com/data-version-control-with-dvc-what-do-the-authors-have-to-say-3c3b10f27ee)

### The state of DVC documentation

DVC is a pretty young project, developed and maintained solely by engineers. As
many OS projects we started from the bottom and for a long time our
[documentation](/doc) was a bunch of bits and pieces. Nowadays improving
documentation is one of our top priorities. We moved to the new in-house built
documentation engine and started working with several technical writers. Certain
parts have been tremendously improved recently, e.g.
[Get Started](/doc/get-started) and
[certain parts of Commands Reference](/doc/commands-reference/fetch) . So far
most of our documentation has been written majorly by the engineering team and
there is need for improving the overall structure and making some parts more
friendly from a new user perspective. We have mostly complete
[reference documentation](/doc/commands-reference) for each command, although
some functions are missing good actionable examples. We also have a
[User Guide](/doc/user-guide/dvc-files-and-directories), however it is not in
very good shape. We strive for making our documentation clear and comprehensive
for users of various backgrounds and proficiency levels and this is where we do
need some fresh perspective.

### How DVC documentation is built

We have an open Github Apache-2 licensed repository for the
[DVC website](https://github.com/iterative/dvc.org), the documentation engine
and the [documentation files](https://github.com/iterative/dvc.org). The website
is built with Node.js + React, including the documentation engine (built
in-house).

Each documentation page is a static Markdown file in the repository, e.g.
[example here](https://github.com/iterative/dvc.org/blob/master/content/docs/command-reference/index.md).
It is rendered dynamically in the browser, no preprocessing is required. It
means that tech writers or contributors need to write/edit a Markdown file,
create a pull request and merge it into the master branch of the
[repository.](https://github.com/iterative/dvc.org) The complete
[documentation contributing guide](https://github.com/iterative/dvc.org/blob/master/README.md#contributing)
describes the directory structure and locations for the different documentation
parts.

### DVC’s approach to documentation work

Documentation tasks and issues are maintained on our doc’s GitHub
[issue tracker](https://github.com/iterative/dvc.org/issues). Changes to the
documentation are made via pull requests on GitHub, and go through our standard
review process which is the same for documentation and code. A technical writer
would be trained in working with our current development process. It generally
means that tech writers or contributors need to write/edit a Markdown file, use
git and Github to create a pull request and publish it. The documentation
[contributing guide](https://github.com/iterative/dvc.org/blob/master/README.md#contributing)
includes style conventions and other details. Documentation is considered of the
same importance as code. Engineering team has a policy to write or update the
relevant sections if something new is released. If it’s something too involved
engineers may create a ticket and ask for help. There is one maintainer who is
responsible for doing final reviews and merging the changes. In this sense, our
documentation is very similar to any other open source project.

## Project ideas for GSoD’19

We identified a number of ideas to work on and there are two major topics these
ideas fall into. Both topics are pretty broad and we don’t expect we can
completely cover them during this GSoD but hopefully we can make certain
progress.

First of all, we want to bring more structure and logic to our documentation to
improve user onboarding experience. The goal is for a new user to have a clear
path they can follow and understand what takeaways each part of the
documentation provides. In particular, improving how
[Get Started](/doc/get-started), [Tutorials](/doc/tutorial) and
[Examples](/doc/tutorials/versioning) relate to each other, restructuring the
existing [User Guide](https://dvc.org/doc/user-guide) to explain basic concepts,
and writing more use cases that resonate with ML engineers and data scientists.

The other issue we would like to tackle is improving and expanding the existing
reference docs — commands descriptions, examples, etc. It involves filling in
the gaps and developing new sections, similar to
[this one](/doc/commands-reference/fetch). We would also love to see more
illustrative materials.

### Project 1: Improving and expanding User Guide

**Description and details:** Reviewing, restructuring and filling major gaps in
the User Guide (introductory parts of the basic concepts of DVC), e.g. have a
look at [this ticket](https://github.com/iterative/dvc.org/issues/144) or
[this one](https://github.com/iterative/dvc.org/issues/53).

**Mentors**: [@shcheklein](https://github.com/shcheklein) and
[@dmpetrov](https://github.com/dmpetrov)

### Project 2: Expanding and developing new tutorials and use cases.

**Description and details:** We already have some requests for more tutorials,
e.g. [this ticket](https://github.com/iterative/dvc.org/issues/96). Here is
another good [use case request](https://github.com/iterative/dvc.org/issues/194)
. If you are going to work on this project you would need some domain knowledge,
preferably some basic ML or data science experience.

**Mentors**: [@shcheklein](https://github.com/shcheklein) and
[@dmpetrov](https://github.com/dmpetrov)

### Project 3: Improving new user onboarding

**Description and details:** Analyze and restructure user walkthrough across
[Get started](/doc/get-started), [Tutorials](/doc/tutorial) and
[Examples](/doc/tutorials/versioning). These three have one thing in common —
hands-on experience with DVC. If you choose this project, we will work together
to come up with a better location for the Examples (to move them out of the Get
Started shadow), and a better location for the Tutorials (to reference external
tutorials that were developed by our community members and published on
different platforms).

**Mentors**: [@shcheklein](https://github.com/shcheklein) and
[@dmpetrov](https://github.com/dmpetrov)

### Project 4: Improving commands reference

**Description and details:** We will work on improving our
[Commands reference](/doc/commands-reference) section. This includes expanding
and filling in the gaps. One of the biggest pain points right now are Examples.
Users want them to be
[easy to run and try](https://github.com/iterative/dvc.org/issues/198) and here
is a lot to be done in terms of improvement. We have a good example of how is
should be done [here](/doc/commands-reference/fetch).

**Mentors**: [@shcheklein](https://github.com/shcheklein) and
[@dmpetrov](https://github.com/dmpetrov)

### Project 5: Describe and integrate “DVC packages”

**Description and details:** Describe the brand new feature “DVC packages” and
integrate it with the rest of the documentation. We have been working hard to
release a few new commands to help with datasets management (have a look at
[this ticket](https://github.com/iterative/dvc/issues/1487)). It’s a major
feature that deserves its place in the Get Started, Use cases, Commands
Reference, etc.

**Mentors**: [@shcheklein](https://github.com/shcheklein) and
[@dmpetrov](https://github.com/dmpetrov)

The ideas we outline above are just an example of what we can work on. We are
open for any other suggestions and would like to work together with the
technical writer to make the contribution experience both useful and enjoyable
for all parties involved. If you have any suggestions or questions we would love
to hear from you => DVC.org/support and our DMs on
[Twitter](https://twitter.com/DVCorg) are always open!

<hr />

Special thanks to the [NumFOCUS](https://numfocus.org/) for the ideas list
inspiration.

If you are a tech writer — check the
[Technical writer guide](https://developers.google.com/season-of-docs/docs/tech-writer-guide).
From April 30, 2019 you can see the list of participating open source
organizations on the [Season of Docs website](https://g.co/seasonofdocs). The
application period for technical writers opens on **May 29, 2019** and ends on
June 28, 2019.
