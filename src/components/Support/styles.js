import styled from 'styled-components'
import color from 'color'

import { container, media } from '../../styles'

export const SupportHero = styled.div`
  padding-top: 90px;
  padding-bottom: 80px;
  overflow: hidden;
`

export const Heading = styled.h1`
  font-family: BrandonGrotesqueMed;
  margin: 0px auto;
  max-width: 610px;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  color: #40364d;
`

export const Container = styled.div`
  ${container};
`

export const Features = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  padding-top: 80px;
  padding-bottom: 70px;
  max-width: 800px;
  margin: 0 auto;

  ${media.phablet`
    padding-top: 70px;
    padding-bottom: 50px;
  `};
`

export const Feature = styled.div`
  flex: 1 0 300px;
  margin: 0 20px 60px;
  padding: 10px;
`

export const FeatureHeading = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

export const Icon = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${props =>
    color(props.color)
      .alpha(0.15)
      .string()};
  margin-right: 10px;

  &::after {
    content: ' ';
    display: block;
    width: 50px;
    height: 50px;
    opacity: 1;
    mask-image: url(${props => props.url});
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: ${props => props.color};
    transform: translate(-10px, 0);
  }
`

export const Name = styled.h3`
  font-family: BrandonGrotesqueMed;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 500;
  color: #40364d;
  min-height: 28px;
`

export const Description = styled.div`
  font-size: 20px;
  color: #5f6c72;
`

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

export const Link = styled.a`
  text-decoration: none;
`

export const Button = styled.button`
  text-decoration: none;
  margin-top: 20px;
  border-radius: 4px;
  background-color: white;
  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  height: 42px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
  padding: 5px 20px;

  &:hover {
    background-color: ${props => props.color};
    color: white;
  }
`

export const DiscrodWidget = styled.img`
  display: block;
  margin-top: 20px;
  margin-left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  mask-image: url('/img/support/discord.svg');
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: #b88eeb;

  &:hover {
    opacity: 0.7;
  }
`
