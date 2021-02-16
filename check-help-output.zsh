#!/bin/zsh

HELP_TEXT_DIR=help-text
COMMAND_REF_DIR=content/docs/command-reference/

# runs the installed dvc, this may be modified to run a particular version in a particular directory
DVC=dvc

if [ ! -d $HELP_TEXT_DIR ] ; then
    mkdir -p $HELP_TEXT_DIR
fi

# dvc --help 

$DVC --help > ${HELP_TEXT_DIR}/dvc-help.txt

for d in ${COMMAND_REF_DIR}/*(/) ; do 
    for f in ${d}/*.md ; do 
        if [[ ${f:t} == "index.md" ]] ; then
            continue
        fi
        cmd=${d:t}
        subcmd=${f:r:t}
        echo $cmd $subcmd
        $DVC ${cmd} ${subcmd} --help > ${HELP_TEXT_DIR}/${cmd}-${subcmd}-help.txt
    done
done

for f in ${COMMAND_REF_DIR}/*.md ; do
    if [[ ${f:t} == "index.md" ]] ; then
        continue
    fi
    cmd=${f:r:t}
    echo $cmd
    $DVC ${cmd} --help > ${HELP_TEXT_DIR}/${cmd}-help.txt
done

for f in ${HELP_TEXT_DIR}/*.txt ; do
    diff=$(git diff ${f})
    if [[ -n "${diff}" ]] ; then
        git diff ${f}
        response=""
        while [[ $response = "y" || $response = "n" ]] ; do
            vared -p "Create Github issue for this change? [y/n]" response
        done
        if [[ $response = "y" ]] ; then
            gh issue create --title "cmd: [auto] changes in ${f} should be reflected to command reference" --body "The diff is \n```${diff}```"
        fi
        git add ${f}
        git commit -m "[auto] updated help output for ${f}"
    fi
done
    
        

