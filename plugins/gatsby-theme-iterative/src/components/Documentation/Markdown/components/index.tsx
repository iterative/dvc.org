import { PropsWithChildren } from 'react'
import Slugger from '../../../../utils/front/Slugger'
import { NoPreRedirectLink } from '../../../Link'
import Admonition from '../Admonition'
import { Tab, Toggle } from '../ToggleProvider'
import { Abbr, Card, Cards, Details } from './default'

export const getComponents = (slugger: Slugger) => ({
  a: NoPreRedirectLink,
  abbr: Abbr,
  card: Card,
  cards: Cards,
  details: ({ id, children }: PropsWithChildren<{ id: string }>) => (
    <Details slugger={slugger} id={id}>
      {children}
    </Details>
  ),
  toggle: Toggle,
  tab: Tab,
  admon: Admonition,
  admonition: Admonition
})
