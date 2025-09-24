---
title: 'Leveraging LLMs in Chatbots: The DVC Approach'
date: 2023-09-25
description: >
  Read how DVC can optimize the development process for chatbots built on Large
  Language Models.
descriptionLong: >
  This post explores how the Data Version Control
  ([DVC](https://dvc.org/doc/start)) tool can enhance the efficiency and
  organization in designing LLM applications, using a Retrieval-Augmented
  Generation
  ([RAG](https://artificialcorner.com/retrieval-augmented-generation-rag-a-short-introduction-21d0044d65ff))
  chatbot as an example. This chatbot uses the RAG approach for its
  computational efficiency, provides cited sources for its answers, and
  leverages DVC features such as rollback capability, preventing redundant
  computations, and visual representation through a Directed Acyclic Graph
  (DAG).
picture: 2023-09-25/dvc-chatbot.png
authors:
  - ryan
tags:
  - LLM
  - RAG
  - DVC
  - Tutorial
---

In the modern world of Machine Learning (ML) and Natural Language Processing
(NLP), there's been a surge in applications built on top of Large Language
Models (LLMs). There has been an almost exponential adoption in applications and
companies building applications from LLMs across a variety of areas.

In this post we will show how DVC can make designing LLM applications more
efficient and organized. We take a Retrieval-Augmented Generation
([RAG](https://artificialcorner.com/retrieval-augmented-generation-rag-a-short-introduction-21d0044d65ff))
approach and illustrate how we can break down the various phases of a RAG
chatbot and version them with DVC. We can use DVC to both "time travel" and
avoid the need to re-compute stages unnecessarily with little extra effort.

## The Rise of Chatbots in Technical Advice

Chatbots are finding a natural fit in providing technical advice. For our
product, DVC, which has amassed significant popularity, we've introduced a
chatbot designed to streamline user experience. Our bot sources information not
just from our official documentation but also from our community discussions on
Discord. This creates a broader knowledge base than using our official
documentation alone, and ensures a balanced mix of official guidelines and
community insights.

## The RAG Approach

Our chatbot uses the Retrieval-Augmented Generation (RAG) approach. The
[debate](https://towardsdatascience.com/rag-vs-finetuning-which-is-the-best-tool-to-boost-your-llm-application-94654b1eaba7)
between the efficacy of RAG vs. fine-tuning methods is ongoing and lively.
However, our choice leans towards RAG due to its simplicity and relative
computation efficiency for quickly iterating on different approaches.

![RAG flowchart](../uploads/images/2023-09-25/flowchart.png '=800')_Illustration
of the RAG approach: First we build a vector database with chunks of text. After
we retrieve chunks relevant to the user query from the vector database, we
insert those chunks into the prompt to give the LLM context._

## Citation: A Key Differentiator

A common complaint about chatbots is that they do not cite any sources, which
leaves users with few avenues to validate the information provided by the
chatbot.

![Chatbot in action video](../uploads/images/2023-09-25/chat_bot_gif.gif '=800')_Demo
of our chatbot_

Our chatbot is able to cite the sources of its answers. It does with using the
LangChain
[RetrievalQAWithSourcesChain](https://api.python.langchain.com/en/latest/chains/langchain.chains.qa_with_sources.retrieval.RetrievalQAWithSourcesChain.html).
This is a key feature for many users.

## Building the Chatbot Using DVC

Our chatbot builds on top of the
[LangChain Notion Question-Answering](https://github.com/hwchase17/notion-qa)
example using DVC to manage the pipeline. Interestingly, while we built a
chatbot for DVC, we also employed DVC in its construction. This seemingly
circular approach allowed us to leverage the standard benefits that DVC offers:

1. **Rollback Facility**: The ability to revert to previous versions is
   invaluable, especially when dealing with unpredictable outputs in response to
   varying prompts.
2. **Efficiency**: DVC prevents redundant computation when updating specific
   phases, saving both time and computational resources.
3. **Visual Representation with DVC DAG**: The Directed Acyclic Graph (DAG)
   provided by DVC visualizes how the chatbot's construction is broken down into
   distinct stages, aiding understanding and development.

```text
+----------------------+
| discord_dump.zip.dvc |
+----------------------+
+-------------------+
| docs_dump.zip.dvc |
+-------------------+
          *
          *
          *
      +--------+
      | expand |
      +--------+
          *
          *
          *
      +--------+
      | ingest |
      +--------+
          *
          *
          *
    +-----------+       +-----------------+
    | vectorize |       | samples.txt.dvc |
    +-----------+       +-----------------+
               ***         ***
                  *       *
                   **   **
                  +-----+
                  | run |
                  +-----+
```

The bot is built into a few standard phases for RAG:

1. `expand`: unzip archives of documents
2. `ingest`: This is how we chunk up the text of the documents into small pieces
   that we can embed and also put into prompts for the chatbot. The standard
   [text splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/character_text_splitter)
   make sense for documentation pages, but a dump of 2 years worth of Discord
   chats require a custom splitter.
3. `vectorize`: Build a
   [vector database](https://github.com/facebookresearch/faiss) with embeddings
   of all the text chunks
4. `run`: Extract the relevant text chunks for the sample questions, put into
   prompts, and call the LLM

DVC allows us to keep the outputs from each stage under version control, and
manage the parameterization, with little extra effort. This provides the
advantage that if we choose to update the vectorize stage, we can reuse the
outputs of the ingest stage without re-running it. Or, if we want to roll back
to an old version of vectorize, we can get that intermediate output back without
re-running it and without the high chance of making a mistake in versioning if
we try to do that manually.

Both the vectorize and run stages use the OpenAI API. So, repeated computation
not only costs time but also actual dollars.

![Text chunking the official docs](../uploads/images/2023-09-25/docs_text_chunking.png '=800')_We
apply a standard text chunker to the markdown for our official documentation. It
contains a few options for chunk size and desired overlap between chunks. DVC
helps organize these parameters._

![Text chunking the public discord](../uploads/images/2023-09-25/discord_text_chunking.png '=800')_For
our discord, we group together successive messages from the same author and then
start a chunk at each message. Putting the author and datetime into the prompts
in the later stages can be formatted in various ways. Experimenting with these
options is easier when you have DVC._

## The Importance of Rollback

Changes in chatbot prompts can have unforeseen consequences. In some cases, they
might improve the bot's performance, while in others, they might lead to
degradation. Given the computational cost of re-running phases and the
unpredictable nature of such changes, rollback doesn't merely refer to reverting
to old code. It also allows reverting to older intermediate outputs, making the
development process much more computationally efficient and organized.

## Incorporating the Discord Community Insights

One significant factor affecting the performance of our chatbot is the manner in
which we segment and integrate text from our Discord channel. Different
text-splitting techniques can lead to variance in performance, highlighting the
importance of continually refining this integration process. Furthermore,
providing useful meta information for sources in Discord can be done in various
ways. Again, DVC handles the book keeping of iterating on these approaches
without re-running unchanged stages.

## Running it Yourself

First clone the git repository [here](https://github.com/iterative/llm-demo).
Once you have an [OpenAI API key](https://platform.openai.com/account/api-keys),
you can easily get the project going with `dvc repro`. Re-running the demo from
scratch costs about $0.40 USD in credits.

First, you need to do a git pull of the code:

```cli
$ git clone git@github.com:iterative/llm-demo.git
$ cd llm-demo
```

The training run is all logged in DVC in an S3 store. So, if you are already
authenticated on AWS you can get all the data with:

```cli
$ dvc pull
```

To set your environment up to run the code, first install all requirements in a
virtual env:

```cli
$ virtualenv env --python=python3
$ source env/bin/activate
$ pip install -r requirements.txt
```

Then set your OpenAI API key (if you don't have one, get one
[here](https://beta.openai.com/playground)):

```cli
$  export OPENAI_API_KEY=...
```

The preceding spaces prevent the API key from staying in your bash history if
that is
[configured](https://stackoverflow.com/questions/6475524/how-do-i-prevent-commands-from-showing-up-in-bash-history).

Now you should be ready to re-run the training pipeline. Assuming you have not
changed anything, nothing should need to run. Everything can be re-used for the
DVC pull:

```cli
$ dvc repro
```

Now you can startup the web UI using:

```cli
$ streamlit run main.py
```

The command should open the bot in your web browser. The log of interactions can
be found in `chat.log`.

## Example of using DVC rollback

Let's take a concrete example illustrating how we can use DVC in the bot
development, suppose we want to adjust the `embedding embedding_ctx_length`
because we think it can help us save some cost on API calls and lower the
interactive latency. To do this in a reproducible way, we first make a git
branch to do the change:

```cli
$ git checkout -b try_new_embed
```

Now if we re-run the pipeline with DVC we will notice that it skips re-running
the expand and ingest phases because nothing has changed for their dependencies:

```cli
$ dvc exp run -S 'OpenAIEmbeddings.embedding_ctx_length=256'
'samples.txt.dvc' didn't change, skipping
Stage 'setup' didn't change, skipping
'docs_dump.zip.dvc' didn't change, skipping
Stage 'expand' didn't change, skipping
Stage 'ingest' didn't change, skipping
Running stage 'vectorize':
$ python vector_store.py
...
```

We can also version the outputs with DVC:

```cli
$ git add dvc.lock params.yaml
$ git commit -m "new embed model"
```

We can try out the new settings with:

```cli
$ streamlit run main.py
```

However, if despite any cost savings we don't like the results with these new
settings, we can easily revert back to old pipeline using git and DVC:

```cli
$ git checkout master
Switched to branch 'master'
Your branch is up to date with 'origin/master'.
$ dvc checkout
M       faiss_store.pkl
M       docs.index
M       results.csv
$ dvc exp run
'samples.txt.dvc' didn't change, skipping
Stage 'setup' didn't change, skipping
'docs_dump.zip.dvc' didn't change, skipping
Stage 'expand' didn't change, skipping
Stage 'ingest' didn't change, skipping
Stage 'vectorize' didn't change, skipping
Stage 'run' didn't change, skipping
Data and pipelines are up to date.
```

DVC does not need to rerun any stage because it has saved all the old outputs
from the master branch. Likewise, we can always switch back to the experimental
setup with:

```cli
$ git checkout try_new_embed
$ dvc checkout
```

Using these few commands, we can use DVC to both "time travel" and avoid the
need to re-compute stages unnecessarily with little extra effort.

## Conclusion

The benefits of using DVC are shared across most LLM applications. Whether you
are working with discord, slack, or a google docs corpus, RAG or fine tuning,
using DVC to manage your pipeline will bring similar benefits. The utilization
of DVC not only enhances the development process but also brings about
reproducible experiments. Given the similarities that most LLM applications
share, it's safe to conclude that they could benefit immensely from
incorporating DVC in their workflows.

---

[Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq) 
to stay up to date with news and contributions from the Community!
