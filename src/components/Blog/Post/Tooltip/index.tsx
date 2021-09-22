/* Used https://reacttraining.com/reach-ui/tooltip as the base */

import Portal from '@reach/portal'
import {
  TooltipPopup,
  TooltipProps,
  useTooltip,
  Position
} from '@reach/tooltip'

import React from 'react'

import styles from './styles.module.css'

const centered: Position = (triggerRect, tooltipRect) => {
  if (!triggerRect || !tooltipRect) {
    return { left: 0, top: 0 }
  }

  const triggerCenter = triggerRect.left + triggerRect.width / 2
  const left = triggerCenter - tooltipRect.width / 2
  const maxLeft = window.innerWidth - tooltipRect.width - 2

  const result = {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.top - 7 - tooltipRect.height + window.scrollY
  }

  return result
}

const portalStyle = (
  triggerRect: DOMRect | null
): { left?: number; top?: number } => {
  if (!triggerRect) {
    return { left: 0, top: 0 }
  }

  return {
    left: triggerRect
      ? triggerRect.left - 4 + triggerRect.width / 2
      : undefined,
    top: triggerRect ? triggerRect.top + window.scrollY - 7 : undefined
  }
}

const ModifiedTooltip: React.FC<TooltipProps> = ({
  children,
  label,
  ariaLabel
}) => {
  const [trigger, tooltip] = useTooltip()

  const { isVisible, triggerRect } = tooltip

  return (
    <>
      {React.cloneElement(children as React.ReactElement, trigger)}

      {isVisible && (
        <Portal>
          <div className={styles.triangle} style={portalStyle(triggerRect)} />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        ariaLabel={ariaLabel}
        className={styles.wrapper}
        position={centered}
      />
    </>
  )
}

export default ModifiedTooltip
