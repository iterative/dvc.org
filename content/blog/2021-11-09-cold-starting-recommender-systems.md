---
title: Cold Starting Recommender Systems
date: 2021-11-09
description: >
  Cold starting is common problem for recommender systems. The recommender
descriptionLong: >

picture: 2021-11-09/cold-start.png
author: milecia_mcgregor
commentsUrl:
tags:
  - Recommender systems
---

When you're building a model to make recommendations to users, you might not
have a lot of data to start with. For example, it's hard to recommend food to
user if you don't know anything about their preferences. This is a tricky
problem known as the cold start problem.

## Background on the cold start problem

There are a few different variations to the cold start problem.

- The new community issue: you might have a lot of items to recommend, but no
  user interaction to determine how to recommend the different options.
- The new user issue: when you have a new user sign up, you don't know anything
  about them so you can't recommend anything.
- The new item issue: when you have a new item to add to your recommender
  system, it has never been recommended before so it's hard to get the user
  interactions on it to properly recommend it.
