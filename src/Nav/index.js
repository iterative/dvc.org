import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { media } from '../styles'
import { logEvent } from '../utils/ga'
import NextLink from 'next/link'
import Router from 'next/router'

const getStarted = () => {
  logEvent('menu', 'get-started')

  Router.push('/doc/get-started')
}

export default function Nav({ mobile = false }) {
  return (
    <Wrapper mobile={mobile}>
      <Links>
        <NextLink href="/features" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'features')
            }}
          >
            Features
          </Link>
        </NextLink>
        <NextLink href="/doc" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'doc')
            }}
          >
            Doc
          </Link>
        </NextLink>
        <Link
          href="https://blog.dvc.org"
          onClick={() => {
            logEvent('menu', 'blog')
          }}
        >
          Blog
        </Link>
        <Link
          href="/chat"
          onClick={() => {
            logEvent('menu', 'chat')
          }}
        >
          Chat
        </Link>
        <Link
          href="https://github.com/iterative/dvc"
          onClick={() => {
            logEvent('menu', 'github')
          }}
        >
          GitHub
        </Link>
        <NextLink href="/support" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'support')
            }}
          >
            Support
          </Link>
        </NextLink>
      </Links>
      <GetStartedButton onClick={getStarted}>Get Started</GetStartedButton>
    </Wrapper>
  )
}

Nav.propTypes = {
  mobile: PropTypes.bool
}

const Links = styled.div`
  display: flex;
  flex-direction: row;
`

const Link = styled.a`
  text-decoration: none;
  text-transform: uppercase;

  font-family: BrandonGrotesqueBold, Tahoma, Arial;
  font-size: 13px;
  color: #838d93;
  padding-top: 10px;
  padding-bottom: 3px;
  border-bottom: 1.5px solid #fff;
  margin-left: 30px;

  &:hover {
    color: #40364d;
    border-bottom: 1.5px solid #40364d;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;

  ${props =>
    props.mobile &&
    `
    display: none;
 `}

  ${media.phablet`
     ${props =>
       !props.mobile &&
       `
        display: none;
     `}
  `};
`

const GetStartedButton = styled.button`
  text-decoration: none;
  margin-left: 40px;
  border-radius: 4px;
  background-color: #13adc7;
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  color: #fff;
  width: 113px;
  height: 38px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #13a3bd;
  }
`
