const fs = require('fs')
const vm = require('node:vm')

require('isomorphic-fetch')

const args = process.argv.slice(2)
const tool = args[0] || 'dvc'

const repoList = {
  dvc: { repo: 'dvc.org', branch: 'main' },
  cml: { repo: 'cml.dev', branch: 'master' },
  mlem: { repo: 'mlem.ai', branch: 'main' }
}

const paths = ['command-reference', 'cli-reference', 'ref']

const sortDashedCommand = (a, b) => {
  if (a.split('-')[0] === b) return -1
  return 0
}

const getUrl = (repo, branch = 'main') => {
  return `https://raw.githubusercontent.com/iterative/${repo}/${branch}/content/docs/sidebar.json`
}

const getAliasList = async (repo, branch = 'main', tool) => {
  try {
    const link = `https://raw.githubusercontent.com/iterative/${repo}/${branch}/content/linked-terms.js`
    const res = await fetch(link)
    if (res.ok) {
      const raw = await res.text()
      const data = vm.runInThisContext(raw.replace('module.exports', 'data'))
      return data
        .filter(item => item.matches.startsWith(`${tool} `))
        .map(item => item.matches.replace(`${tool} `, ''))
    } else throw new Error('Error with response')
  } catch {
    return []
  }
}

const writeCommandsToFile = async (commands, tool) => {
  const file = `${__dirname}/${tool}-commands.js`

  const start = 'module.exports = [\n'
  const end = ']\n'
  const content =
    start + `${commands.map(cmd => `  '${cmd}'`).join(',\n')}\n` + end

  fs.writeFileSync(file, content)
}

const getCommands = async tool => {
  const url = getUrl(repoList[tool].repo, repoList[tool].branch)
  const res = await fetch(url)
  const sidebar = await res.json()
  const cmdRef = sidebar.find(item => paths.includes(item.slug))
  if (!cmdRef) {
    throw new Error(`Could not find command reference in sidebar.json`)
  }
  const commands = []
  cmdRef.children.forEach(item => {
    const { label, children } = item
    if (Array.isArray(children)) {
      children.forEach(subitem => {
        const { label } = subitem
        commands.push(label)
      })
    }
    commands.push(label)
  })

  const alias = await getAliasList(
    repoList[tool].repo,
    repoList[tool].branch,
    tool
  )
  commands.push(...alias)
  commands.sort(sortDashedCommand)

  writeCommandsToFile(commands, tool)
}
const getNestedCommands = async (tool, parentTool) => {
  const url = getUrl(repoList[parentTool].repo, repoList[parentTool].branch)
  const res = await fetch(url)
  const sidebar = await res.json()
  const parent = sidebar.find(item => item.slug === tool)
  if (!parent || !Array.isArray(parent?.children)) {
    console.error(
      `Error: Could not find ${tool} command reference in sidebar.json`
    )
    return
  }
  const cmdRef = parent.children.find(item => paths.includes(item.slug))
  if (!cmdRef) {
    throw new Error(`Could not find command reference in sidebar.json`)
  }
  const commands = []
  cmdRef.children.forEach(item => {
    const { label, children } = item
    if (Array.isArray(children)) {
      children.forEach(subitem => {
        const { label } = subitem
        commands.push(label)
      })
    }
    commands.push(label)
  })

  const alias = await getAliasList(
    repoList[parentTool].repo,
    repoList[parentTool].branch,
    tool
  )
  commands.push(...alias)
  commands.sort(sortDashedCommand)

  writeCommandsToFile(commands, tool)
}

switch (tool) {
  case 'dvc':
  case 'cml':
  case 'mlem':
    {
      getCommands(tool).catch(err => {
        console.error(err)
      })
    }
    break
  case 'gto':
    {
      getNestedCommands(tool, 'mlem').catch(err => {
        console.error(err)
      })
    }
    break
  case 'all': {
    // dvc
    getCommands('dvc').catch(err => {
      console.error(err)
    })
    // cml
    getCommands('cml').catch(err => {
      console.error(err)
    })
    // mlem
    getCommands('mlem').catch(err => {
      console.error(err)
    })
    // gto
    getNestedCommands(tool, 'mlem').catch(err => {
      console.error(err)
    })
  }
}
