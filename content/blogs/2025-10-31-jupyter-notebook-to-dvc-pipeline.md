---
title:
  'Transforming a Jupyter Notebook into a Reproducible Pipeline for Experiments
  with DVC'
date: 2025-10-31
description: >
  Rob De De Wit shares his Pokémon Generator project to demonstrate how you can
  move from Jupyter Notebook prototype to a production-ready pipeline with DVC.
descriptionLong: >
  This blog post is an adaptation of Rob De Wit’s presentation on the subject
  using his Pokémon Generator project at PyData USA 2023. You can find [the
  video here](https://www.youtube.com/watch?v=sDhpIZQXe-w) and [the repo of the
  project here](https://github.com/RCdeWit/sd-pokemon-generator).

picture: 2025-10-31/jupyter-to-dvc-cover.png
pictureComment:
  Learn how to transform your Jupyter Notebook prototype into a production-ready
  DVC pipeline.
authors:
  - rob_dewit
tags:
  - Open Source
  - DVC
  - Tutorial
  - Guide
  - Jupyter Notebook
  - Pokémon
  - LoRA
---

When we experiment with machine learning models, it’s easy to get lost in the
cycle of trying new parameters, swapping datasets, or adjusting architectures.
That’s how progress is made, but without structure, reproducibility, and
tracking, you risk losing valuable results or being unable to explain why a
model worked (or failed).

In this post, I use a Pokémon generator I created with
[LoRA](https://huggingface.co/docs/diffusers/training/lora) (Low-Rank Adaptation
of Large Language Models) to demonstrate how I approach turning one-off
prototypes into structured, reproducible pipelines using versioned data,
parameters, and experiments.

![Pokémon image generated with LoRA](../uploads/images/2025-10-31/pokemon-generator-output.png '=600')

## Why Reproducibility Matters

Reproducibility is the backbone of science, and machine learning is no
different. A reproducible experiment means:

- The same combination of **data, code, and parameters** produces the same
  result.
- You can trace back decisions: **which dataset, which hyperparameters, which
  preprocessing steps**.
- **Collaboration** can be acheived. Your colleagues (and your future self!) can
  understand and build upon your work.

When I worked on earlier projects, we often had to reconstruct models after the
fact, trying to remember what went into training them. That experience convinced
me that reproducibility should be built into every pipeline from day one. That’s
why I treat every experiment as a **deterministic combination of code + data +
parameters**, and I build pipelines that make this explicit.

## Moving from Jupyter Notebook to a Reproducible Pipeline

Jupyter notebooks are a great tool for prototyping data science projects, but
not the best go-to when needing to reproduce your results. Part of the greatness
is the ability to easily change cells and re-run sections, visualize data
in-line with code, and share analysis with narrative text. But on the flip side,
these benefits can lead to a breakdown in your ability to accurately reproduce
results. Notebooks are also challenging to test, scale, and manage dependencies.
So how can we set up our pipeline for reproducible success?

![Git plus DVC](../uploads/images/2025-10-31/git-plus-dvc.png '=600')

## Enter DVC

If you’ve ever tried to manage large files with Git, you have come to realize
that Git in and of itself is not sufficient. DVC operates like Git, but for
large data, models, and your machine learning experimentation process,
versioning everything along with the code. Let’s see how this works under the
hood.

## How DVC tracks your Data

![DVC dataset tracking](../uploads/images/2025-10-31/dataset-images.png '=600')

In your Git repository, you have a main branch with commits and a branch with a
dataset, in this case a dataset of Pokémon images.

![DVC metadata](../uploads/images/2025-10-31/dataset-metadata.png '=600')

As image data are large, we do not want to keep them in Git so DVC replaces them
with a metadata file. The metadata for the dataset contains the hash, the size,
number of files, and other data.

![DVC dataset hash](../uploads/images/2025-10-31/dataset-hash.png '=600')

The hash in Git points to the .dvc/cache, which is where the physical images are
actually stored on your file system.

![DVC new dataset hash](../uploads/images/2025-10-31/new-dataset-hash.png '=600')

If you create another commit with a different dataset (noted by a different font
on the left in the Git repo). A new hash will point to the new dataset in the
.dvc/cache. In this case, one image was removed and one added with two staying
the same.

## How a DVC Pipeline Works

Below you will find the sections of the Jupyter Notebook on the left. Each of
these stages produces outputs as seen on the right.

![Machine learning stages and outputs](../uploads/images/2025-10-31/pipeline-outputs.png '=600')

As these are now specified, they can be used as downstream dependencies for
other stages.

![Pipeline dependencies](../uploads/images/2025-10-31/pipeline-dependencies.png '=600')

So if the `train_lora` stage is dependent on the processed images, we can ensure
that the stage only triggers once there are new images in the processed
directory. Additionally, if we make a change in the `train_lora` stage, none of
the previous stages that were not changed will need to be run with DVC, saving
you development time.

## How Tracking Experiments Work with Git and DVC

In addition to your data and pipeline, DVC can version your experiments along
with Git. We use DVC for larger files and Git for the smaller files.

![Experiment tracking with Git and DVC](../uploads/images/2025-10-31/track-experiments-dvc-git.png '=600')

All of these things together represent an experiment and can be recorded as a
git commit with a hash. This way this experiment and all its modifications will
be able to be reproduced using a `git checkout` and `dvc checkout` with its hash
(See experiment hash noted at bottom.)

![Each experiment can receive a hash](../uploads/images/2025-10-31/experiment-commit-hash.png '=600')

## Converting from a Jupyter Notebook to a DVC Project

We will set up our Pokémon generator as a DVC project.

### Building the Pipeline

Here’s the approach I’ve taken to bring structure into experimentation:

1. **Start with a Base Model.** Use an off-the-shelf model as your foundation.
   Fine-tune it, adapt it, and make it your own, but always know what version
   you started from.
2. **Track Everything.** Every dataset, parameter, and code change should be
   versioned. We can use DVC for this. Think of it like Git for your machine
   learning workflow: commits that point not just to code, but to data and model
   states.
3. **Modularize the Workflow.** Break experiments into stages: data prep,
   training, evaluation, etc. That way, you can rerun only what changes instead
   of starting from scratch every time.
4. **Run Reproducible Experiments.** Each experiment should be captured so you
   can roll back, compare results, and build confidence in the best-performing
   model.
5. **Move Toward Production.** Once an experiment proves itself, package it into
   a pipeline that can run with a single command. That pipeline is what bridges
   the gap between “something interesting in a notebook” and “a reliable system
   in production.”

### Step 1: Define the Pipeline

Start by breaking your workflow into stages. For example, in this project the
dvc.yaml looks like this:

```yaml
stages:
  set_up_diffusers:
    cmd: |
      git clone --depth 1 --branch v0.14.0 https://github.com/huggingface/diffusers.git diffusers
      pip3.10 install -r "diffusers/examples/dreambooth/requirements.txt"
      accelerate config default
    outs:
      - diffusers:
          cache: false
  scrape_pokemon_images:
    cmd: python3 src/scrape_pokemon_images.py --params params.yaml
    deps:
      - src/scrape_pokemon_images.py
    outs:
      - data/external/pokemon
  download_pokemon_stats:
    cmd:
      kaggle datasets download -d brdata/complete-pokemon-dataset-gen-iiv -f
      Pokedex_Cleaned.csv -p data/external/
    outs:
      - data/external/Pokedex_Cleaned.csv
  resize_pokemon_images:
    cmd: python3 src/resize_pokemon_images.py --params params.yaml
    deps:
      - src/resize_pokemon_images.py
      - data/external/pokemon
      - data/external/Pokedex_Cleaned.csv
    outs:
      - data/processed/pokemon
    params:
      - base
      - data_etl
  train_lora:
    cmd: >
      accelerate launch --mps
      "diffusers/examples/dreambooth/train_dreambooth_lora.py"
      --pretrained_model_name_or_path=${train_lora.base_model}
      --instance_data_dir=${data_etl.train_data_path}
      --output_dir=${train_lora.lora_path} --instance_prompt='a pkmnlora
      pokemon' --resolution=512 --train_batch_size=1
      --gradient_accumulation_steps=1 --checkpointing_steps=500
      --learning_rate=${train_lora.learning_rate} --lr_scheduler='cosine'
      --lr_warmup_steps=0 --max_train_steps=${train_lora.max_train_steps}
      --seed=${train_lora.seed}
    deps:
      - diffusers
      - data/processed/pokemon
    outs:
      - models/pkmnlora
    params:
      - data_etl
      - train_lora
  generate_text_to_image:
    cmd: python3 src/generate_text_to_image.py --params params.yaml
    outs:
      - outputs
    deps:
      - src/generate_text_to_image.py
      - models/pkmnlora
    params:
      - train_lora
      - generate_text_to_image
```

Each stage declares:

- **Command (cmd)** – what to run
- **Dependencies (deps)** – inputs the stage needs
- **Outputs (outs)** – files the stage produces. This way, when you change a
  dependency (e.g., a new dataset or updated parameter), only the affected
  stages re-run.

### Step 2: Track Parameters

Instead of hardcoding hyperparameters, keep them in a structured file like
params.yaml:

```yaml
base:
  train_pokemon_type: all

data_etl:
  external_data_path: 'data/external/'
  train_data_path: 'data/processed/pokemon'

train_lora:
  seed: 1337
  model_directory: 'models'
  base_model: 'runwayml/stable-diffusion-v1-5'
  lora_path: 'models/pkmnlora'
  learning_rate: 0.0001
  max_train_steps: 15000

generate_text_to_image:
  seed: 3000
  num_inference_steps: 35
  batch_size: 1
  batch_count: 20
  prompt: 'a pkmnlora pokemon'
  negative_prompt: ''
  output_directory: 'outputs'
  use_lora: True
```

Now you can run controlled experiments:

```bash
$ dvc exp run -S training.learning_rate=0.01
```

This will execute the pipeline with the updated parameter, track the run, and
save results.

### Step 3: Track Experiments

For this Pokémon project, it’s not as relevant because the results are images
with subjective grading. But with projects where you’re tracking metrics, with
pipelines defined and parameters externalized, you can now compare experiments
systematically:

```bash
$ dvc exp show
```

Example output:

| Experiment | train.learning_rate | train.epochs | Accuracy | Loss |
| ---------- | ------------------- | ------------ | -------- | ---- |
| baseline   | 0.001               | 10           | 0.82     | 0.41 |
| exp-1234   | 0.01                | 10           | 0.85     | 0.37 |
| exp-5678   | 0.001               | 20           | 0.84     | 0.39 |

This makes it easy to see how parameter changes affect performance—without
losing reproducibility.

### Step 4: Move Toward Production

Once you’re confident in a pipeline:

1. Lock the configuration – commit your dvc.yaml and params.yaml.
2. Version your data – every dataset version is tracked (no guessing which CSV
   was used).
3. Promote a model – move the best checkpoint into a production/ folder or model
   registry. Then your entire workflow can be reproduced with a single command:

```bash
$ dvc repro
```

That runs the whole pipeline—data prep, training, evaluation—with the exact same
inputs and parameters.

## Lessons Learned

- **Reproducibility = productivity**. You spend less time debugging “mystery
  results.”
- **Experiment tracking is collaborative**. Colleagues can see exactly what you
  tried, what worked, and what didn’t.
- **Pipelines scale**. What starts as a notebook prototype can evolve into a
  production-ready workflow.

## Final Thoughts

Experimentation will always be messy—but pipelines don’t have to be. By
structuring workflows into reproducible pipelines, you get the freedom to
explore while ensuring you can always reproduce and explain your results. If
you’d like to try this yourself, check out the
[example pipeline](https://github.com/RCdeWit/sd-pokemon-generator) repo and the
[docs](https:dvc.org/doc) for more info on building workflows specific to your
project.

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
