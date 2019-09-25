import React from 'react'
import styled from 'styled-components'

export default function SearchForm(props) {
  return (
    <Wrapper novalidate>
      <Input
        type="text"
        id="doc-search"
        placeholder={`Search docs`}
        {...props}
      />
    </Wrapper>
  )
}

const Wrapper = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
`

const Input = styled.input`
  display: flex;
  flex: 1;
  height: 100%;
  border-radius: 200px;
  background-color: #ffffff;
  border: solid 1px #dbe4ea;
  padding-left: 48px;
  padding-right: 24px;
  background-image: url('/static/img/search.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  font-size: 16px;
  font-weight: 500;
  width: 240px;
  box-sizing: border-box;
  display: block;
`
