import React from 'react'
import Page from '../Page'
import Subscribe from '../Subscribe'

import { Wrapper, Title, Content } from './styles'

function Page404() {
  return (
    <Page stickHeader={true}>
      <Wrapper>
        <Title>Not Found</Title>
        <Content>
          You just hit a route that doesn&#39;t exist... the sadness.
        </Content>
      </Wrapper>
      <Subscribe />
    </Page>
  )
}

export default Page404
