import styled from 'styled-components'

export const Image = styled.img`
  width: 100%;
  border-radius: 5px 5px 0 0;
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
    margin-left: 20px;
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
  font-size: 24px;
  font-family: BrandonGrotesqueBold;
  line-height: 34px;
  text-decoration: none;
  color: ${({ color }) => color};

  &:hover {
    opacity: 0.7;
  }
`

export const Meta = styled.div`
  margin-top: 10px;
  line-height: 20px;
`

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`
