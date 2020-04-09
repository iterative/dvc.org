declare module '*.png' {
  type IPNG = string

  const png: IPNG
  export = png
}

declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

declare module '*.svg' {
  interface IReactSVGR {
    default: string
    ReactComponent: React.StatelessComponent<React.SVGAttributes<SVGElement>>
  }
  const svg: IReactSVGR
  export = svg
}

declare module 'scroll' {
  type ScrollTo = (
    node: Element,
    position: number,
    options: {},
    cb?: (err: Error | null, position: number) => void
  ) => () => void
  type ScrollModule = {
    left: ScrollTo
    top: ScrollTo
  }
  const scroll: ScrollModule
  export = scroll
}

declare module 'ease-component' {
  type EaseFunction = (value: number) => number
  type EaseModule = {
    [key: string]: EaseFunction
  }
  const ease: EaseModule
  export = ease
}

declare module 'iso-url' {
  export const URL: typeof window.URL
}
