import styled from 'styled-components'

import { media } from '../../styles'

export const Wrapper = styled.section`
  position: relative;
  height: 278px;
  background-color: #945dd6;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Container = styled.div`
  width: 100%;
  max-width: 1035px;
`

export const Title = styled.h3`
  font-family: BrandonGrotesqueMed;
  max-width: 438px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  margin: 0px auto;
`

export const Buttons = styled.div`
  display: flex;
  max-width: 386px;
  margin: 0px auto;
  margin-top: 20px;
  align-items: center;
  flex-direction: row;
  ${media.phablet`
    flex-direction: column;
  `};
`

export const Button = styled.a`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;

  min-width: 186px;
  height: 60px;
  padding: 0px 21px;
  border-radius: 4px;
  border: solid 2px rgba(255, 255, 255, 0.3);

  font-family: BrandonGrotesqueMed;
  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;
  text-decoration: none;
  text-align: left;
  color: #ffffff;

  background-color: #945dd6;
  background: url('/img/arrow_right_white.svg') right center no-repeat;
  background-position-x: 147px;
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #885ccb;
  }

  ${props =>
    props.first &&
    `
    color: #945dd6;
    margin-right: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);

    background-image: url('/img/arrow_right_dark.svg');
    transition: 0.2s background-color ease-out;

    &:hover {
      background-color: #F5F5F5
    }

     ${media.phablet`
      margin-right: 0px;
   `}
  `};

  ${media.phablet`
    margin-bottom: 12px;
    margin-right: 0px !important;
  `};
`

export const Glyph = styled.img`
  position: absolute;
  z-index: 0;
  width: 158px;
  height: auto;

  ${media.tablet`
    width: 110px;
  `};

  object-fit: contain;

  ${props =>
    props.gid === 'topleft' &&
    `
    top: -25px;
    left: 40px;
  `}

  ${props =>
    props.gid === 'rigthbottom' &&
    `
    bottom: -60px;
    right: 30px;
  `};

  ${media.phablet`
    display: none;
  `};
`
