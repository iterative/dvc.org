# Shared Storage on NFS

Data is increasing exponentially in terms of size and information. In the modern
software development environment, teams are working together on same dataset to
get the results. It became necessary that data is accessible to everyone and
every team member has a same updated dataset. For this example, we will be using
NFS (Network File System) for storing and sharing files on the network.

With DVC, we need not to copy the dataset on our local machine everytime when
new data is added to dataset. We can set the `cache directory` on NFS server.
The cached data will be present in the NFS server, which in turn will be fast to
access and process requests faster.

> With large data files it is better to set the cache directory to NFS. Not only
> just it will cache the data faster but also version the data. Thus you would
> avoid copying large files from you NFS server to the machine.

Lets configure NFS server and client to see how DVC can help to make the
workflow faster.

<details>

# Setting up the NFS server

In order to set up the host system to share directories, we will need to install
the NFS Kernel server on it, and then create and export the directories that we
want the client systems to access. Let's setup the NFS server:

### Step 1: Install NFS Kernel Server

```dvc
$ sudo apt install nfs-kernel-server
```

### Step 2: Create the Export Directory

The directory that we want to share with the client system is called an export
directory. Let's create a folder named as `sharedfolder` under `/mnt`.

```dvc
$ sudo mkdir -p /mnt/sharedfolder
```

As we want all clients to access the directory, we will remove restrictive
permissions of the export folder through the following commands:

```dvc
$ sudo chown nobody:nogroup /mnt/sharedfolder
$ sudo chmod 777 /mnt/sharedfolder
```

Now all users from all groups on the client system will be able to access our
`sharedfolder`.

### Step 3: Assign server access to client(s) through NFS export file

After creating the export folder, we will need to provide the clients the
permission to access the host server machine. This permission is defined through
the exports file located in your system’s `/etc` folder.

```dvc
$ sudo nano /etc/exports
```

Allow access to multiple clients, by specifying an entire subnet that the
clients belong to:

```dvc
/mnt/sharedfolder subnetIP/24(rw,sync,no_subtree_check)
```

In this example, we are specifying an entire subnet of all the clients we want
to grant access to our export folder (sharedfolder):

### Step 4: Export the shared directory

After making all the above configurations in the host system, now is the time to
export the shared directory through the following command as sudo:

```dvc
$ sudo exportfs -a
```

Finally, in order to make all the configurations take effect, restart the NFS
Kernel server as follows:

```dvc
$sudo systemctl restart nfs-kernel-server
```

### Step 5: Open firewall for the client (s)

An important step is to verify that the server’s firewall is open to the clients
so that they can access the shared content. In our example, we are giving access
to an entire subnet of clients machines through the following command:

```dvc
$ sudo ufw allow from 192.168.100/24 to any port nfs
```

</details>

<details>

# Setting up the client machine

Now is the time to make some simple configurations to the client machine, so
that the shared folder from the host can be mounted to the client and then
accessed smoothly.

### Step 1: Install NFS Common

Run the following command in order to install the NFS Common client on your
system:

```dvc
$ sudo apt-get install nfs-common
```

### Step 2: Create a mount point for the NFS host’s shared folder

Your client’s system needs a directory where all the content shared by the host
server in the export folder can be accessed. You can create this folder anywhere
on your system. We are creating a mount folder in the mnt directory of our
client’s machine:

```dvc
$ sudo mkdir -p /mnt/sharedfolder_client
```

### Step 3: Mount the shared directory on the client

The folder that you created in the above step is like any other folder on your
system unless you mount the shared directory from your host to this newly
created folder.

Use the following command in order to mount the shared folder from the host to a
mount folder on the client:

```dvc
$ sudo mount serverIP:/exportFolder_server /mnt/mountfolder_client
```

In our example, we are running the following command to export our
“sharedfolder” from the server to the mount folder “sharedfolder_client” on the
client machine:

```dvc
$ sudo mount 192.168.100.5:/mnt/sharedfolder /mnt/sharedfolder_client

```

### Step 4: Test the connection

Please create or save a file in the export folder of the NFS host server. Now,
open the mount folder on the client machine; you should be able to view the same
file shared and accessible in this folder.

</details>

# Real data

With DVC, we can easily setup a shared cache storage on the NFS server that will
allow your team to share and store data for your projects as effectively as
possible and have a workspace restoration/switching speed as instant
as`git checkout` for your code.

### Preparation

In order to make it work on a shared server, we need to setup a shared cache
location for your projects, so that every team member is using the same cache
location.

> It will be beneficial to have a shared cache location on the server. It avoid
> copying large files from shared server to the local machine.

After configuring NFS on both server and client side. Let's create an export
directory on server side where all data will be stored.

```dvc
mkdir -p /project1_data
```

You will have to make sure that the directory has proper permissions setup,so
that every one on your team can read and write to it and can access cache files
written by others. The most straightforward way to do that is to make sure that
you and your colleagues are members of the same group (e.g. 'users') and that
your shared directory is owned by that group and has respective permissions.

Let's create a mount point of client side.

```dvc
mkdir -p /mnt/dataset/project1_data
```

### Configure Cache

After mounting the shared directory on client side. Assuming project code is in
`/home/user/project1`. Let's initialize a `dvc repo`.

```dvc
cd /home/user/project1/
dvc init
git add .dvc .gitignore
git commit . -m "initialize DVC"
```

Tell DVC to use the directory we've set up as an external cache location by
running:

```dvc
dvc cache dir /mnt/data  #changing dvc cache directory
dvc config cache.type "reflink,symlink,hardlink,copy"
dvc config cache.protected true
git add .dvc .gitignore
git commit . -m "DVC cache location updated"
```

`cache.type "reflink,symlink,hardlink,copy"` - enables symlinks to avoid copying
large files.

`cache.protected true` - to make links `read only` so that we you don't corrupt
them accidentally

### Add data to DVC cache

Now, add first version of the dataset into the DVC cache (this is done once for
a dataset).

```dvc
cd /mnt/dataset/
cp -r . /home/user/project1/
cd /home/user/project1
mv /mnt/dataset/project1_data/ data/
dvc add data
```

Commit changes to `.dvc/config` and push them to your git remote:

```dvc
git add data.dvc .gitignore
git commit . -m "add first version of the dataset"
git tag -a "v1.0" -m "dataset v1.0"
git push origin HEAD
git push origin v1.0
```

Next, you can easily get this appear in your workspace by:

```dvc
cd /home/user/project1/
git pull
dvc checkout
```
