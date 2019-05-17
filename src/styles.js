import styled, { css } from 'styled-components'

export function fontFace(
  name,
  src,
  fontWeight = 'normal',
  fontStyle = 'normal'
) {
  return `
        @font-face{
            font-family: "${name}";
            src: url(${'/static/fonts/' + src + '.otf'});
            font-style: ${fontStyle};
            font-weight: ${fontWeight};
        }
    `
}

export const global = `
  ${fontFace('BrandonGrotesque', 'Brandon_reg')}
  ${fontFace('BrandonGrotesqueBold', 'Brandon_bld')}
  ${fontFace('BrandonGrotesqueMed', 'Brandon_med')}
  ${fontFace('BrandonGrotesqueLight', 'Brandon_light')}
  
	html {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased !important;
    font-smoothing: antialiased;
    font-weight: 400;
    text-rendering: optimizeLegibility !important;
  }
  
  @-moz-document url-prefix() {
    body {
      font-weight: lighter !important;
    }
  }
	
	body {
		padding: 0px;
		font-family: BrandonGrotesque, Tahoma, Arial;
		font-weight: normal;
		-webkit-font-smoothing: antialiased;
    line-height: 1.5;
    
    // IE flex min-height fix https://stackoverflow.com/a/40491316
    display: flex;
    flex-direction: column;
	}
	
	*:focus {
    outline: 0;
  }
`

const maxWidth = 1005

export const sizes = {
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 376
}

sizes.phablet = Math.floor((sizes.tablet + sizes.phone) / 2)

export const media = Object.keys(sizes).reduce((accumulator, label) => {
  accumulator[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `
  return accumulator
}, {})

export const container = css`
  margin: 0 auto;
  max-width: ${maxWidth}px;
  padding: 0px 15px;

  ${media.tablet`
    padding: 0px 61px 0px 67px;
    max-width: auto;
  `} ${media.phablet`
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
  `} ${props =>
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
