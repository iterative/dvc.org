import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Modal = ({ children }) =>
  ReactDOM.createPortal(children, document.getElementById('modal-root'))

Modal.propTypes = {
  children: PropTypes.node.isRequired
}

export default Modal
