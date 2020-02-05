import styled from 'styled-components'

export const Wrapper = styled.a`
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
