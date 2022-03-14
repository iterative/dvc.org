import { KeyboardEvent, KeyboardEventHandler } from 'react'

const onSelectKey = (handler: KeyboardEventHandler<HTMLButtonElement>) => {
  return (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handler(event)
    }
  }
}
export default onSelectKey
