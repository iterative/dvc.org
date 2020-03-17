import React from 'react'
import Subscribe from '../Subscribe'

import { Wrapper, Title, Content } from './styles'

function Page404() {
  return (
    <>
      <Wrapper>
        <Title>Not Found</Title>
        <Content>
          You just hit a route that doesn&#39;t exist... the sadness.
        </Content>
      </Wrapper>
      <Subscribe />
    </>
  )
}

export default Page404
