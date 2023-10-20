# Providing data to our support

To help you troubleshoot issues with DVC Studio, we may request a support
bundle, which contains DVC Studio's application logs.

This guide will walk you through how to create the support bundle.

## Prerequisites

<toggle>
<tab title="VM (AMI)">

If you've deployed DVC Studio using a VM image, please launch an SSH session to
the instance before continuing.

</tab>

<tab title="Helm">

If you've deployed DVC Studio directly with Helm, please download the
`create-support-bundle` script before continuing.

```cli
$ curl -o create-support-bundle https://raw.githubusercontent.com/iterative/studio-selfhosted/main/packer/create-support-bundle.sh
$ chmod +x create-support-bundle
```

</tab>
</toggle>

## Creating the support bundle

Run the `create-support-bundle` script to create the support bundle ZIP file.

```cli
$ create-support-bundle
```

Copy the ZIP file from `/tmp/studio-support.tar.gz` to your local machine. To do
this, you can use SFTP or rsync.
