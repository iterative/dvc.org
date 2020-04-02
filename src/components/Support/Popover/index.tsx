import React, { useState } from 'react'
import ReactPopover, { PopoverProps } from 'react-popover'

import './styles.module.css'

type IPopoverProps = {
  children: React.ReactNode
} & PopoverProps

const Popover: React.SFC<IPopoverProps> = ({ children, ...restProps }) => {
  const [isOpened, setOpened] = useState(false)
  const toggle = () => setOpened(prev => !prev)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.which === 13 || e.which === 32) {
      toggle()
    }
  }
  const close = () => setOpened(false)

  return (
    <ReactPopover isOpen={isOpened} onOuterAction={close} {...restProps}>
      <div onClick={toggle} role="button" onKeyDown={onKeyDown} tabIndex={0}>
        {children}
      </div>
    </ReactPopover>
  )
}

export default Popover
