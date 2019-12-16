import styled from 'styled-components'

export const Image = styled.img`
  width: 100%;
  border-radius: 20px 20px 0 0;
`

export const ImageWrapper = styled.a`
  display: block;
  margin: -10px -20px 0;
`

export const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  align-items: stretch;

  & + & {
    margin-left: 30px;
  }
`

export const Items = styled.div`
  display: flex;
  align-items: stretch;
  padding-top: 30px;
`

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`
