import json
import os
import subprocess
import sys
import tempfile

from pathlib import Path

COLORS = {
    "neutral": [
        "Experiment",
        "Created"
    ],
    "metric": [
        "avg_prec",
        "roc_auc",
        "loss",
        "acc"
    ],
    "param": [
        "prepare.split",
        "prepare.seed",
        "featurize.max_features",
        "featurize.ngrams",
        "train.seed",
        "train.n_est",
        "train.min_split",
        "train.epochs",
        "model.conv_units"
    ],
    "dep": [
        "data/features",
        "src/evaluate.py",
        "src/featurization.py",
        "src/prepare.py",
        "data/data.xml",
        "model.pkl",
        "src/train.py",
        "data/prepared"
    ]
}


def _add_color_highlight(input_folder, colors):
    print("Adding color highlight")
    for exp_show_output in Path(input_folder).iterdir():
        text = exp_show_output.read_text()
        for color, columns in colors.items():
            for column in columns:
                text = text.replace(
                    column,
                    f"{color}:**{column}**"
                )
        exp_show_output.write_text(text)


def _dump_tables(input_folder, output_folder):
    tables = []
    print("Dumping to tables.js format")
    for exp_show_output in Path(input_folder).iterdir():
        text =  exp_show_output.read_text()
        print(f"${exp_show_output.stem}")
        print(text)
        tables.append(
            {
                "placeholder": f"${exp_show_output.stem}",
                "replacement": text
            }
        ) 
    return tables


def _capture_exp_show_output(show_calls, output_folder, prefix):
    print("Capturing raw exp show output")
    for extra_args, suffix in show_calls:
        with open(f"tables/{prefix}{suffix}.md", "w") as f:
            subprocess.run(
                ["dvc", "exp", "show"] + extra_args,
                stdout=f)


def _get_started_tables():
    with tempfile.TemporaryDirectory() as tmpdir:
        os.chdir(tmpdir)

        subprocess.run(["git", "clone", "https://github.com/iterative/example-get-started"])

        os.chdir("example-get-started")
        os.makedirs("tables")

        subprocess.run(["dvc", "pull"])

        subprocess.run(
            ["dvc", "exp", "run", "--queue", "-S", "featurize.max_features=500"])
        subprocess.run(
            ["dvc", "exp", "run", "--queue", "-S", "featurize.max_features=1000"])
        subprocess.run(
            ["dvc", "exp", "run", "--queue", "-S", "featurize.max_features=2000"])

        subprocess.run(["dvc", "exp", "run", "--run-all", "-j", "3"])

        show_calls = [
            ([], ""),
            (["--only-changed"], "-only-changed"),
            (["--drop", "prepare"], "-drop-prepare"),
            (["--drop", "avg_prec|train.min_split"], "-drop-regex"),
            (["--only-changed", "--drop", "Created", "--keep", "train.(?!seed)"], "-combined"),
            (["--only-changed", "--sort-by=roc_auc", "--sort-order", "desc"], "-sort-desc"),
            (["--all-commits", "--only-changed", "--sort-by=roc_auc"], "-all-commits"),
        ]

        _capture_exp_show_output(show_calls, "tables", "get-started-exp-show")
        _add_color_highlight("tables", COLORS)
        tables = {
            exp_show_output.stem: exp_show_output.read_text()
            for exp_show_output in Path("tables").iterdir()
        }

    return tables 


def _dvc_experiments_tables():
    with tempfile.TemporaryDirectory() as tmpdir:
        os.chdir(tmpdir)

        subprocess.run(["git", "clone", "https://github.com/iterative/example-dvc-experiments"])

        os.chdir("example-dvc-experiments")
        os.makedirs("tables")

        subprocess.run(["dvc", "exp", "pull", "--no-cache", "origin", "cnn-64"])
        subprocess.run(["dvc", "exp", "pull", "--no-cache", "origin", "cnn-128"])

        show_calls = [
            ([], ""),
        ]
        _capture_exp_show_output(show_calls, "tables", "dvc-experiments-exp-show")
        _add_color_highlight("tables", COLORS)
        tables = {
            exp_show_output.stem: exp_show_output.read_text()
            for exp_show_output in Path("tables").iterdir()
        }

    return tables


def create_all_tables(output_folder):
    cwd = Path.cwd()
    all_tables = {}
    all_tables.update(_get_started_tables())
    all_tables.update(_dvc_experiments_tables())
    os.chdir(cwd)

    print(f"Saving to {output_folder}")
    Path(output_folder).mkdir(exist_ok=True, parents=True)
    for k, v in all_tables.items():
        (Path(output_folder) / k).write_text(v)


if __name__ == "__main__":
    create_all_tables(sys.argv[1])
