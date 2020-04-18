/* eslint-env node */

const PageWrapper = require('./src/components/PageWrapper').default
const { getDetails, setDetails } = require('./src/utils/shared/localStorage')

exports.wrapPageElement = PageWrapper

exports.onPreRouteUpdate = ({ location, prevLocation }) => {
  const detailsList = document.querySelectorAll('.Collapsible')
  let details = getDetails()
  detailsList.forEach(detail => {
    const titleElement = detail.childNodes[0]
    const textElement = detail.childNodes[1]
    const detailData = { title: '', text: '' }
    detailData.title = titleElement.textContent
    detailData.text = textElement.textContent

    if (titleElement.classList[1] == 'is-open') {
      details = [detailData, ...details]
    }
  })
  setDetails(details)
}
