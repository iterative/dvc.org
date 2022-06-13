import React, { useState, PropsWithChildren } from 'react'
import ReactPopover from 'react-popover'

import { isTriggeredFromKB } from '@dvcorg/gatsby-theme-iterative/src/utils/front/keyboard'

import './styles.module.css'

interface IPopoverProps {
  body: React.ReactNode
  enterExitTransitionDurationMs: number
}

const Popover: React.FC<PropsWithChildren<IPopoverProps>> = ({
  children,
  ...restProps
}) => {
  const [isOpened, setOpened] = useState(false)
  const toggle = (): void => setOpened(prev => !prev)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (isTriggeredFromKB(e)) {
      toggle()
    }
  }
  const close = (): void => setOpened(false)

  return (
    // @ts-expect-error Error is caused by package and out of our control
    <ReactPopover isOpen={isOpened} onOuterAction={close} {...restProps}>
      <div onClick={toggle} role="button" onKeyDown={onKeyDown} tabIndex={0}>
        {children}
      </div>
    </ReactPopover>
  )
}

export default Popover
