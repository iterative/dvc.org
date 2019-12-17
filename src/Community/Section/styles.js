import styled from 'styled-components'

export const Wrapper = styled.div`
  margin: 50px -50px;
  padding: ${({ background }) => (background ? '0 50px 260px' : '0 50px')};
  background-size: 1100px 450px;
  background-repeat: no-repeat;
  background-position: bottom center;
  background-image: ${({ background }) =>
    background ? `url(${background})` : 'none'};
`

export const Header = styled.div`
  display: flex;
  color: ${({ color }) => color};
`

export const Title = styled.div`
  font-size: 40px;
  font-family: BrandonGrotesqueMed;
  line-height: 60px;
`

export const Icon = styled.img`
  margin: -2px 0;
`

export const Description = styled.div`
  max-width: 600px;
  margin-top: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #838d93;
`

export const Content = styled.div``
