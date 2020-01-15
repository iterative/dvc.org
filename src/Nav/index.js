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
        <DropdownWrapper>
          <NextLink href="/community" passHref>
            <Link
              onClick={() => {
                logEvent('menu', 'community')
              }}
            >
              Community
            </Link>
          </NextLink>
          <Dropdown>
            <NextLink href="/community#meet" passHref>
              <DropdownLink
                onClick={() => {
                  logEvent('menu', 'community')
                }}
              >
                Meet the Community
              </DropdownLink>
            </NextLink>
            <NextLink href="/community#contribute" passHref>
              <DropdownLink
                onClick={() => {
                  logEvent('menu', 'community')
                }}
              >
                Contribute
              </DropdownLink>
            </NextLink>
            <NextLink href="/community#learn" passHref>
              <DropdownLink
                onClick={() => {
                  logEvent('menu', 'community')
                }}
              >
                Learn
              </DropdownLink>
            </NextLink>
            <NextLink href="/community#events" passHref>
              <DropdownLink
                onClick={() => {
                  logEvent('menu', 'community')
                }}
              >
                Event
              </DropdownLink>
            </NextLink>
          </Dropdown>
        </DropdownWrapper>
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

  display: block;
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
  padding: 1px 7px 2px;

  &:hover {
    background-color: #13a3bd;
  }
`

const DropdownWrapper = styled.span`
  position: relative;
`

const Dropdown = styled.div`
  display: none;
  position: absolute;
  top: 32px;
  left: 30px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.18);

  ${DropdownWrapper}:hover & {
    display: block;
  }
`

const DropdownLink = styled.a`
  display: block;
  font-size: 13px;
  font-family: BrandonGrotesqueBold, Tahoma, Arial;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  color: #838d93;

  &:hover {
    color: #40364d;
  }

  & + & {
    margin-top: 10px;
  }
`
