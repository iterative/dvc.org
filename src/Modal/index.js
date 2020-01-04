import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const Modal = ({ children }) =>
  ReactDOM.createPortal(children, document.getElementById('modal-root'))

Modal.propTypes = {
  children: PropTypes.node.isRequired
}

export default Modal
