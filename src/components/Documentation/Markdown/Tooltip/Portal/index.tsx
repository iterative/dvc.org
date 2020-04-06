import ReactDOM from 'react-dom'

const Portal: React.SFC<{ children: React.ReactNode }> = ({ children }) =>
  ReactDOM.createPortal(
    children,
    document.getElementById('portal') as HTMLElement
  )

export default Portal
