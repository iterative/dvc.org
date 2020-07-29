---
title: '(Tab) Complete Any Python Application in 1 Minute or Less'
date: 2020-07-27
description: |
  We've made a painless tab-completion script generator for Python applications!
  Find out how to take advantage of it in this blog post.

descriptionLong: |
  We've made a painless tab-completion script generator for Python applications!
  It's called `shtab` and it currently works with `argparse`, `docopt`, and
  `argopt` to produce `bash` and `zsh` completion scripts.
  This tool was originally created to help `dvc`, but we realised it could be made
  more generic and valuable to the world's entire ecosystem of Python CLI
  applications. Find out how to take advantage of it in this blog post.
picture: 2020-07-27/tab-py.jpg
pictureComment: Zero Effort Tab Completion for Python Applications
author: casper_dcl
commentsUrl: https://discuss.dvc.org/t/tab-complete-any-python-application-in-1-minute-or-less/455
tags:
  - shtab
  - Release
  - CLI
  - Autocomplete
  - Tab
  - Completion
---

Command line tools are powerful. Things like [`make`] have manual pages
spanning, well,
[pages](https://www.gnu.org/software/make/manual/make.html#Options-Summary),
while just the list of [`git`] subcommands is longer than can fit on a standard
`80 x 24` terminal screen.

```dvc
$ git <TAB>
add                  filter-branch        rebase
am                   format-patch         reflog
annotate             fsck                 relink
...
describe             prco                 unassume
--More--
```

Notice the `--More--` at the bottom? That's the joy of pagination.

Notice the `<TAB>` at the top? That represents actually pressing the tab key.
Ah, the joy of shell tab completion.

Tab completion is an indispensable part of writing anything on the command-line.
Personally, I can't imaging trying to `git co` (aliased to `git checkout`) a
branch without `<TAB>` to do the heavy lifting.
[They say](https://en.wikipedia.org/wiki/Letter_frequency) "E" is the most
common vowel, and "T" the most common consonant. My keyboard use probably looks
more like this:

![](/uploads/images/2020-07-27/key-frequencies.png 'Yes, I use vim =500')_My key
usage_

Now there's a tool called `dvc` which is like [Git for data](https://dvc.org).
It can be viewed as a cross-platform combination of [`git`] and [`make`]
designed for handling big data and multiple cloud storage repositories, as well
as tracking machine learning experiments. As you can imagine, supporting that
many buzzwords means it also has a large number of subcommands and options.

_Every time a new feature is added, maintainers and contributors have to update
tab completion scripts for multiple supported shells. At best, it's a pain, and
at worst, error-prone. If you've worked on maintaining CLI applications, you'll
sympathise._

Surely the parser code you've written is informative enough to automate tab
completion? Surely you shouldn't have to maintain and synchronise separate tab
completion scripts?

Good news: [`shtab`] is a new tool which magically does all of this work.

Any Python CLI application using [`argparse`], [`docopt`], or [`argopt`] can
have tab completion for free!

Simply hand your parser object to `shtab` (either via the CLI or the Python
API), and a tab completion script will be generated for your preferred shell.
It's as easy as:

- CLI: `shtab --shell=bash myprogram.main.parser`, or
- Python API: `import shtab; print(shtab.complete(parser, shell="bash"))`.

### `argparse` example

Suppose you have some code in a module `hello.main`:

```python
import argparse

def get_main_parser():
    parser = argparse.ArgumentParser(prog="hello")
    parser.add_argument(
        "who", help="good question", nargs="?", default="world")
    parser.add_argument(
        "--what", help="a better question", default="hello",
        choices=["hello", "goodbye"])
    return parser

if __name__ == "__main__":
    parser = get_main_parser()
    args = parser.parse_args()
    print("{}, {}!".format(args.what, args.who))
```

To get tab completion for `bash`, simply install [`shtab`] and then run:

```bash
shtab --shell=bash hello.main.get_main_parser \
  | sudo tee "$BASH_COMPLETION_COMPAT_DIR"/hello >/dev/null
```

Zsh user? Not a problem. Simply run:

```bash
shtab --shell=zsh hello.main.get_main_parser \
  | sudo tee /usr/local/share/zsh/site-functions/_hello >/dev/null
# note the underscore `_` prefix in the filename
```

Handily you can install `shtab`'s own completions by following the above
examples replacing `hello` with `shtab`.

![](/uploads/images/2020-07-27/dvc.gif)_`shtab`-driven `dvc` completion in
`bash` and `zsh`_

Using `shtab`, here's what
[`dvc`'s completion](https://dvc.org/doc/install/completion) looks like when
installed:

```dvc
% dvc <TAB>
Completing dvc commands
add         -- Track data files or directories with DVC.
cache       -- Manage cache settings.
checkout    -- Checkout data files from cache.
commit      -- Save changed data to cache and update DVC-files.
completion  -- Prints out shell tab completion scripts.
At Top: Hit TAB for more, or the character to insert
```

All completion suggestions guaranteed in-sync with the code! The maintainers of
`dvc` were very surprised to find no less than
[84 commits](https://github.com/iterative/dvc/commits/master/scripts/completion)
touching their old completion scripts. Such churn is now a thing of the past!

You might notice one of the subcommands provided by `dvc` is
[`completion`](https://dvc.org/doc/install/completion). Here's a quick example
of how to provide such convenience for users:

### Integrating library example

Feeling minimal? How about adding `import shtab` to your application itself for
a cleaner user interface? And let's use [`argopt`] to convert [`docopt`]'s neat
syntax to `argparse` while we're at it.

```python
"""Greetings and partings.

Usage:
  greeter [options] [<you>] [<me>]

Options:
  -g, --goodbye  : Say "goodbye" (instead of "hello")
  -b, --print-bash-completion  : Output a bash tab-completion script
  -z, --print-zsh-completion  : Output a zsh tab-completion script

Arguments:
  <you>  : Your name [default: Anon]
  <me>  : My name [default: Casper]
"""
import sys, argopt, shtab

parser = argopt.argopt(__doc__)
if __name__ == "__main__":
    args = parser.parse_args()
    if args.print_bash_completion:
        print(shtab.complete(parser, shell="bash"))
        sys.exit(0)
    if args.print_zsh_completion:
        print(shtab.complete(parser, shell="zsh"))
        sys.exit(0)

    msg = "k thx bai!" if args.goodbye else "hai!"
    print("{} says '{}' to {}".format(args.me, msg, args.you))
```

### Try it out

There are many more options and features. The [documentation][`shtab`] includes
examples of working with custom file completions and providing a `completion`
subcommand when integrating more tightly with existing applications.

Try it out with `pip install -U shtab` or `conda install -c conda-forge shtab`!

Is it worth the time?

![](https://imgs.xkcd.com/comics/is_it_worth_the_time.png)_It's worth it
[xkcd#1205](https://xkcd.com/1205)_

[`shtab`] would be on the second row, far left (maybe even off grid). It's worth
spending days to get right yet only takes seconds to install.

[`argopt`]: https://pypi.org/project/argopt
[`argparse`]: https://docs.python.org/library/argparse
[`docopt`]: https://pypi.org/project/docopt
[`dvc`]: https://github.com/iterative/dvc
[`git`]: https://git-scm.com
[`make`]: https://en.wikipedia.org/wiki/Make_(software)
[`shtab`]: https://github.com/iterative/shtab
