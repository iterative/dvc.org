import React from 'react'
import styled from 'styled-components'

export default ({ onChange = () => {}}) => (
  <SearchForm
    novalidate
  >
    <Input
      type="text"
      onChange={onChange}
    />
  </SearchForm>
)

const SearchForm = styled.form`
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
`