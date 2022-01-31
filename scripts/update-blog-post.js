const fs = require('fs').promises
const matter = require('gray-matter')

const filePath = process.argv[2]
if (filePath) {
  file = matter.read(filePath)
  const { data: currentData } = file
  const updatedData = {
    ...currentData,
    updated_at: new Date().toISOString()
  }
  file.data = updatedData
  const updatedFileContent = matter.stringify(file)
  fs.writeFile(filePath, updatedFileContent)
}
