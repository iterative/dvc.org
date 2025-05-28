import MainLayout, {
  ILayoutComponentProps,
  LayoutModifiers
} from '../MainLayout'

const alertComponentModifiers: LayoutModifiers[] = [
  LayoutModifiers.Collapsed,
  LayoutModifiers.HideAlert
]

const AlertLandingLayout = (props: ILayoutComponentProps) => {
  const modifiers: LayoutModifiers[] =
    props.modifiers === undefined
      ? alertComponentModifiers
      : alertComponentModifiers.concat(props.modifiers)
  return <MainLayout {...props} modifiers={modifiers} />
}

export default AlertLandingLayout
