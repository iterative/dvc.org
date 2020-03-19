import styled from 'styled-components'

import { media } from '../../styles'

export const SearchArea = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #eef4f8;
  z-index: 10;
  position: sticky;
  top: 0;

  ${media.phablet`
    position: relative;
    padding: 0 20px;
  `};

  form {
    height: 40px;
  }
`

export const Wrapper = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
`

export const Input = styled.input`
  display: flex;
  flex: 1;
  height: 100%;
  border-radius: 200px;
  background-color: #ffffff;
  border: solid 1px #dbe4ea;
  padding-left: 48px;
  padding-right: 24px;
  background-image: url('/img/search.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  font-size: 16px;
  font-weight: 500;
  width: 240px;
  box-sizing: border-box;
  display: block;
`
