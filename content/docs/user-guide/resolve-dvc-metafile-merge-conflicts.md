---

title: "Resolve merge conflicts in DVC metafiles"

description: "How to resolve merge conflicts that involve .dvc files, .dir, and DVC metafiles created by DVC."

---



\# How to resolve merge conflicts that involve DVC metafiles



When collaborating with Git, you might encounter merge conflicts in files that DVC manages (.dvc files, `.dir`/`.dvc` metafiles, or DVC-generated YAML/JSON files). This guide explains safe, reproducible steps to resolve those conflicts.



> \*\*Goal:\*\* keep Git history consistent while ensuring DVC metadata remains coherent so `dvc repro`, `dvc push` and `dvc pull` work after the merge.



---



\## 1. Identify the type of conflicting file



DVC commonly stores metadata in:

\- \*\*`.dvc` files\*\* — per-file pointers (small text files tracked by Git).

\- \*\*`dvc.yaml` / `dvc.lock`\*\* — pipeline definitions and locks.

\- \*\*`.dir` / `.dir.dvc`\*\* or other cache/metadata files (depending on the project layout).



If the conflict is in any of these, follow the steps below.



---



\## 2. Typical safe workflow to resolve the conflict



1\. \*\*Don't rush — make a local backup\*\*

&nbsp;  ```bash

&nbsp;  git status

&nbsp;  git diff -- <conflicted-file> > /tmp/conflict-<filename>.diff

&nbsp;  git add -A



