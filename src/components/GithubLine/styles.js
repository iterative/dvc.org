import styled from 'styled-components'

export const Wrapper = styled.div`
  font-family: BrandonGrotesqueMed;
  line-height: 20px;
  height: 20px;
  display: flex;
  align-items: center;
`

export const Link = styled.a`
  font-family: BrandonGrotesqueMed;
  color: #40364d;
  margin-left: 0.3em;

  &:focus,
  &:hover,
  &:visited {
    color: #40364d;
  }
`

export const Github = styled.img`
  font-family: BrandonGrotesqueMed;
  margin-right: 9px;
`

export const Star = styled.img`
  margin-left: 7px;
`

export const Count = styled.span`
  font-family: BrandonGrotesqueMed;
  margin-left: 6.3px;
`
