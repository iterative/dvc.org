import styled from 'styled-components'

export const Action = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  left: 20px;
`

export const Content = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: #838d93;
`

export const Header = styled.div`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d8dfe3;
  font-family: BrandonGrotesqueMed;
  font-size: 24px;
  line-height: 34px;
  color: #24292e;
`

export const Icon = styled.img``

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: ${({ hasAction }) =>
    hasAction ? '10px 20px 78px' : '10px 20px 20px'};
  border-radius: 20px;
  background: #eef4f8;
`
