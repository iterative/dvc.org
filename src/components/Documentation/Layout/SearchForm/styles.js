import styled from 'styled-components'

import { media } from '../../../../styles'

export const SearchArea = styled.div`
  box-sizing: border-box;
  height: 60px;
  padding-top: 10px;
  background: rgb(238, 244, 248);
  background: linear-gradient(
    180deg,
    rgba(238, 244, 248, 1) 0%,
    rgba(238, 244, 248, 1) 86%,
    rgba(238, 244, 248, 0) 100%
  );
  z-index: 10;
  position: sticky;
  top: var(--layout-header-height-collapsed);

  ${media.phablet`
    position: relative;
    padding: 10px 20px 0;
    top: 0;
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
