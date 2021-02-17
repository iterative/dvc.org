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

check_output_diff () {
    cmd=$1
    subcmd=$2
    out_f=${HELP_TEXT_DIR}/${cmd}-${subcmd}-help.txt
    echo $cmd $subcmd
    $DVC ${cmd} ${subcmd} --help > ${out_f}
    diff=$(git diff --ignore-all-space ${out_f})
    if [[ -n "${diff}" ]] ; then
        git diff ${out_f}
        response=""
        while [[ ( ("$response" != "y") && ("$response" != "n") ) ]] ; do
            vared -p "Create Github issue for this change? [y/n]" response
        done
        if [[ "$response" == "y" ]] ; then
            diff=$(git diff ${out_f} | tail -n +7)
            the_body="The diff in the command output is\\n\`\`\`diff\\n${diff}\\n\`\`\`"
            echo "$the_body"
            gh issue create --title "cmd: [auto] changes in \`dvc ${cmd} ${subcmd} --help\` should be reflected to command reference" --body "${the_body}"
        fi
        # git add ${f}
        # git commit -m "[auto] updated help output for ${f}"
    fi
}

for d in ${COMMAND_REF_DIR}/*(/) ; do 
    for f in ${d}/*.md ; do 
        if [[ ${f:t} == "index.md" ]] ; then
            continue
        fi
        cmd=${d:t}
        subcmd=${f:r:t}
        check_output_diff $cmd $subcmd
    done
done

for f in ${COMMAND_REF_DIR}/*.md ; do
    if [[ ${f:t} == "index.md" ]] ; then
        continue
    fi
    cmd=${f:r:t}
    check_output_diff $cmd
done


