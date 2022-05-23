---
title: Introducing the DVC extension for Visual Studio Code
date: 2022-06-14
description: >
  Lorem ipsum dolor sit amet
descriptionLong: >
  Lorem ipsum dolor sit amet
picture: 2022-06-15/header.png
author: rob_dewit
# commentsUrl:
tags:
  - VS Code
  - DVC
  - MLOps
  - Release
---

Since its beta release in 2017 DVC has grown to be an essential tool for many
data science teams. Its data versioning capabilities, reproducible pipelines,
and experiment tracking features are at the core of our ecosystem of open MLOps
tools.

Today we are proud to launch a new product that extends the ways in which ML
teams can use DVC: our extension for Visual Studio Code.

DVC was built as an extension to Git workflows. This approach has made it a
powerful tool that can easily be picked up by users familiar with Git. However,
for those less familiar with CLI tools, it can be more difficult to get
accustomed to using DVC. Moreover, while DVC provides many useful
visualizations, a CLI tool can only take things so far.

That's why we wanted to expand upon the basis of DVC by:

- Making DVC more accessible by hiding the complexity of the CLI
- Enhancing existing visualizations and providing new ones
- Moving the entire data science workflow into your IDE

# Why Visual Studio Code

One of [our core beliefs at Iterative](https://iterative.ai/why-iterative/) is
that our products should couply tightly with existing tools and processes for
data science projects. VS Code is the IDE of choice for many of us at Iterative,
and we really like it. Here's a few reasons why:

VS Code...

- is open source and lightweight
- is becoming an industry standard for Python and data science
- has great support for Git workflows
- supports Jupyter Notebooks
- comes with remote development and execution built in

# Features

Our first course of action was to include all DVC features related to data
management and experiments in the extension. Here are the features that are
currently available:

## Command palette

Our extension makes extensive use of the Command Palette, reducing the need to
learn commands by heart.

![Use the command palette to quickly find DVC
features](/uploads/images/2022-06-15/command-palette.gif)

## Source control management

Manage changes to your datasets and models right from the source control panel,
just like you would track changes to your code. Use `checkout`, `commit`, `add`,
`push`, and `pull` straight from the interface:

![Get a quick overview of changes to your data in the source control
panel](/uploads/images/2022-06-15/source-control.png)

## Tracked resources

## DVC View Container

## Experiments Table

## Plots

# What next?
