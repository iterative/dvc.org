import cn from 'classnames'

const showOnClasses = {
  xs: 'xs:block',
  sm: 'sm:block',
  md: 'md:block',
  lg: 'lg:block'
}

export type ScreenSize = keyof typeof showOnClasses

export const getShowOnClass = (size: ScreenSize | undefined): string =>
  size ? cn('hidden', showOnClasses[size]) : 'block'
