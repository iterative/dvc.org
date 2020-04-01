import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  .Popover {
    
    .Popover-body {
      box-shadow: rgba(0,0,0,0.14) 0px 0px 4px, rgba(0,0,0,0.28) 0px 4px 8px;
      padding: 5px 15px;
      background: white;
      color: black;
    }

    .Popover-tip {
      display: none;
    }
  }
`
