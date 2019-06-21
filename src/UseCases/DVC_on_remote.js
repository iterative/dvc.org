After checking into Share Data & Model Files, you can train the model on AWS S3 using Spotty Spot instances and with the help of dvc.

For that follow the following steps:

 git clone the repository on which you want to work on. Here, we are using Tacotron model which trains a deep neural network on speech synthesis system by
 conditioning Wavenet on MEL spectogram predictions. ``git clone https://github.com/Rayhane-mamah/Tacotron-2.git``. 

 Spotty trains model inside docker container,so we can use Tensorflow image in DockerHub to get the requirements set. Here, we will be using Tacotron model
 which requires Python3 and Tensorflow so we can get the tensorflow image from Docker Hub. For that you need to install docker. You can take help from here:
 https://docs.docker.com/install/ after setting up docker, you can ``docker pull tensorflow/tensorflow`` to get the tensorflow image.

 Since, this image doesn't satisfy all the requirements from "requirements.txt", we need to install necessary libraries on top of it.

Copy the "requirements.txt" to "docker/requirements-spotty.txt" file and create the docker/Dockerfile.spotty with content as below:

FROM tensorflow/tensorflow:1.13.1-gpu-py3-jupyter

# install a pyaudio dependency
RUN apt-get updat \
    && apt-get install -y portaudio19-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install requirements
COPY requirements-spotty.txt requirements-spotty.txt
RUN pip3 install -r requirements-spotty.txt

Sign up for AWS services and configure it.
Once, we have Dockerfile, we are ready to write a Spotty configuration file. Create a spotty.yaml file in the root directory.
project:
  name: tacotron
  syncFilters:
    - exclude:
        - .idea/*
        - .git/*
        - '*/__pycache__/*'
        - training_data/*

container:
  projectDir: /workspace/project
  file: docker/Dockerfile.spotty
  ports: [6006, 8888]
  volumeMounts:
    - name: workspace
      mountPath: /workspace

instances:
  - name: i1
    provider: aws
    parameters:
      region: ap-south-1
      instanceType: p2.xlarge
      dockerDataRoot: /docker
      volumes:
        - name: workspace
          parameters:
            size: 50
            deletionPolicy: retain
        - name: docker
          parameters:
            size: 10
            mountDir: /docker
            deletionPolicy: retain

scripts:
  preprocess: |
    curl -O http://data.keithito.com/data/speech/LJSpeech-1.1.tar.bz2
    tar xvjf LJSpeech-1.1.tar.bz2
    rm LJSpeech-1.1.tar.bz2
    python preprocess.py
  train: |
    python train.py --model='Tacotron-2'
  tensorboard: |
    tensorboard --logdir /workspace/project/logs-Tacotron-2
  jupyter: |
    jupyter notebook --allow-root --ip 0.0.0.0 --notebook-dir=/workspace/project

Install spotty
pip3 install -U spotty


 Its time to versioning the Data and Model files.
 Check our Data and Model Files Versioning for better understanding.
 DVC stores versioning of datasets and ML models. It is really more helpful than git-lfs as it doesn't require installing a remote server.
 ``git checkout -branch dvc_1``
 first we will retain the original datasets and models in the main branch. Although after versioning the datafiles and models are intact,I want to keep a
 version the same as the cloned repository.
 ``dvc init``
 To keep track of model we will first initialize DVC in our repository. DVC creates .dvc/ directory that stores .dvc/.gitignore and .dvc/config. You can
 track all these files by using ``git status``. It also creates a .dvc/cache directory that stores cache for data.``git commit --interactive`` and then 
 follow up the instructions to update or add files.

 Then, we will track the datasets, files, models, etc using DVC. For that ``dvc add datasets spotty.yaml ...`` Add all the files, datasets, which are not
  tracked by git(SCM). NOTE: .py files will show error while tracking with DVC like``dvc add preprocess.py train.py`` Check the ``git status`` then do a 
  ``git commit --interactive`` and follow up the instructions likewise.

Run a spot instance using

``spotty start``

Upload the data to spotty instance by ``dvc run``. Then a ``git push``

Run the following commands to get the model run on instance created earlier.

spotty run preprocess
spotty run train

Once done, use
spotty stop

Download using ``dvc pull`` and ``git pull`` eventually.

