import React, { useState } from 'react'
import ReactPopover, { PopoverProps } from 'react-popover'

import { isTriggeredFromKB } from '../../../utils/front/keyboard'

import './styles.module.css'

type IPopoverProps = {
  children: React.ReactNode
} & PopoverProps

const Popover: React.FC<IPopoverProps> = ({ children, ...restProps }) => {
  const [isOpened, setOpened] = useState(false)
  const toggle = (): void => setOpened(prev => !prev)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (isTriggeredFromKB(e)) {
      toggle()
    }
  }
  const close = (): void => setOpened(false)

  return (
    <ReactPopover isOpen={isOpened} onOuterAction={close} {...restProps}>
      <div onClick={toggle} role="button" onKeyDown={onKeyDown} tabIndex={0}>
        {children}
      </div>
    </ReactPopover>
  )
}

export default Popover
