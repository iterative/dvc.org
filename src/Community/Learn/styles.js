import styled from 'styled-components'

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
    margin-left: 30px;
  }
`

export const Items = styled.div`
  display: flex;
  align-items: stretch;
  padding-top: 30px;
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
  color: ${({ color }) => color};

  &:hover {
    opacity: 0.7;
  }
`

export const Meta = styled.div`
  line-height: 20px;
`

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`
