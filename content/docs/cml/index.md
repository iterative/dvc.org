# CML is Continuous Machine Learning

Continuous Machine Learning (CML) is an open-source library for implementing
continuous integration & delivery (CI/CD) in machine learning projects. Use it
to automate parts of your development workflow, including model training and
evaluation, comparing ML experiments across your project history, and monitoring
changing datasets.

![](/img/cml_neural_transfer.png) _On every pull request, CML helps you
automatically train and evaluate models, then generates a visual report with
results and metrics. Above, an example report for a
[neural style transfer model](https://rb.gy/ub5idx)._

We built CML with these principles in mind:

- **[GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) for data
  science.** Use GitLab or GitHub to manage ML experiments, track who trained ML
  models or modified data and when. Codify data and models with
  [DVC](#using-cml-with-dvc) instead of pushing to a Git repo.
- **Auto reports for ML experiments.** Auto-generate reports with metrics and
  plots in each Git Pull Request. Rigorous engineering practices help your team
  make informed, data-driven decisions.
- **No additional services.** Build your own ML platform using just GitHub or
  GitLab and your favorite cloud services: AWS, Azure, GCP. No databases,
  services or complex setup needed.

_Need help? Just want to chat about continuous integration for ML?
[Visit our Discord channel!](https://discord.gg/bzA6uY7)_

🌟🌟🌟 Check out our
[YouTube video series](https://www.youtube.com/playlist?list=PL7WG7YrwYcnDBDuCkFbcyjnZQrdskFsBz)
for hands-on MLOps tutorials using CML! 🌟🌟🌟

https://youtu.be/9BgIDqAzfuA
