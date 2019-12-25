import styled from 'styled-components'
import { media } from '../styles'

export const Comments = styled.a`
  display: inline-block;
  height: 20px;
  padding: 0 5px;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  background-color: #d8dfe3;

  &:hover {
    opacity: 0.7;
  }
`

export const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  align-items: stretch;

  & + & {
    margin-left: 20px;

    ${media.tablet`
      margin: 5px 0 0 0;
    `}
  }
`

export const Items = styled.div`
  display: flex;
  align-items: stretch;
  padding-top: 30px;

  ${media.phablet`
    padding: 0;
  `}

  ${media.tablet`
    flex-direction: column;
  `}
`

export const Line = styled.div`
  & + & {
    margin-top: 20px;
  }
`

export const Link = styled.a`
  font-size: ${({ large }) => (large ? '24px' : '16px')};
  font-family: BrandonGrotesqueBold;
  line-height: ${({ large }) => (large ? '34px' : '18px')};
  text-decoration: none;
  overflow-wrap: break-word;
  color: ${({ color }) => color};

  &:hover {
    opacity: 0.7;
  }
`

export const Meta = styled.div`
  line-height: 20px;
`

export const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;

  ${media.tablet`
    padding: 0 5px;
  `}
`
