import styled from 'styled-components'
import { media } from '../../styles'

export const Comments = styled.a`
  text-decoration: none;
  color: inherit;

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
    margin-left: 30px;

    ${media.desktop`
      margin-left: 15px;
    `}

    ${media.tablet`
      display: block;
      margin: 15px 0 0 0;
    `}
  }
`

export const Items = styled.div`
  display: flex;
  align-items: stretch;
  padding-top: 40px;

  ${media.phablet`
    padding-top: 20px;
  `}

  ${media.tablet`
    display: block;
  `}
`

export const Line = styled.div`
  overflow: hidden;

  & + & {
    margin-top: 20px;
  }
`
export const ImageLine = styled(Line)`
  display: flex;
`

export const Link = styled.a`
  font-size: ${({ large }) => (large ? '24px' : '16px')};
  font-family: BrandonGrotesqueBold;
  line-height: ${({ large }) => (large ? '34px' : '18px')};
  text-decoration: none;
  word-break: break-word;
  overflow-wrap: anywhere;
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
    margin: 0 15px;

    & + & {
      border-top: 1px solid #e6e8e9;
    }
  `}
`

export const TextWrapper = styled.div``

export const NbspWrapper = styled.span`
  white-space: nowrap;
`

export const HeaderLink = styled.a`
  font-family: BrandonGrotesqueMed;
  font-size: 24px;
  line-height: 34px;
  color: #24292e;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`

export const PageWrapper = styled.div`
  ${media.tablet`
    padding-bottom: 30px;
  `}

  ${media.phablet`
    padding-bottom: 0;
  `}
`

export const Button = styled.a`
  display: block;
  height: 38px;
  border-radius: 4px;
  font-size: 16px;
  font-family: BrandonGrotesqueMed;
  line-height: 38px;
  text-decoration: none;
  text-align: center;
  color: ${({ color }) => (color ? color : '#999')};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : '#ddd'};

  &:hover {
    opacity: 0.7;
  }
`
