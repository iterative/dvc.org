import styled, { css } from 'styled-components'

const maxWidth = 1005

export const sizes = {
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 376
}

sizes.phablet = Math.floor((sizes.tablet + sizes.phone) / 2)

export const media = Object.keys(sizes).reduce((acc, s) => {
  return Object.assign(acc, {
    [s]: (...args) => css`
      @media (max-width: ${sizes[s]}px) {
        ${css(...args)};
      }
    `
  })
}, {})

export const container = css`
  margin: 0 auto;
  max-width: ${maxWidth}px;
  padding: 0px 15px;

  ${media.tablet`
    padding: 0px 61px 0px 67px;
    max-width: auto;
  `}

  ${media.phablet`
    padding: 0px 31px 0px 31px;
    max-width: auto;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    padding: 0px 61px 0px 67px;
    max-width: auto;
  }
`

export const Mark = styled.span`
  ${props =>
    props.bg &&
    `
    background-color: ${props.bg};
  `}

  ${props =>
    props.text &&
    `
    color: ${props.text};
  `}
  padding-left: 2px;
  padding-right: 2px;
`

export const columns = css`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-between;

  ${media.tablet`
    flex-direction: row;
  `};

  ${media.phablet`
    justify-content: center;
  `};
`

export const column = css`
  flex-basis: 33.3%;

  ${media.tablet`
    flex-basis: 50%;
  `};

  ${media.phablet`
    flex-basis: 100%;
  `};
`

export const centered = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const OnlyMobile = styled.div`
  display: none;
  ${media.giant`display: none;`};
  ${media.desktop`display: none;`};
  ${media.tablet`display: none;`};
  ${media.phablet`display: initial;`};
  ${media.phone`display: initial;`};
`

export const OnlyDesktop = styled.div`
  display: initial;
  ${media.giant`display: initial;`};
  ${media.desktop`display: initial;`};
  ${media.tablet`display: initial;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`

export const OnlyMobileInline = styled.span`
  display: none;
  ${media.giant`display: none;`};
  ${media.desktop`display: none;`};
  ${media.tablet`display: none;`};
  ${media.phablet`display: inline-block;`};
  ${media.phone`display: inline-block;`};
`

export const OnlyDesktopInline = styled.span`
  display: inline-block;
  ${media.giant`display: inline-block;`};
  ${media.desktop`display: inline-block;`};
  ${media.tablet`display: inline-block;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`
