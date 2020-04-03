import styled from 'styled-components'

import { media } from '../../../styles'

import { LightButton } from '../styles'

export const Content = styled.article`
  min-width: 200px;
  margin: 30px;
  flex: 1;
  background-color: #fff;

  ${media.phablet`
    margin: 15px 0;
  `};

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  em {
    font-style: italic;
  }

  .markdown-body {
    font-family: inherit;
    font-size: 18px;
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: fadeIn;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 500;
    }

    a[target='_blank']:after {
      position: relative;
      top: 1px;
      right: 0;
      width: 12px;
      height: 12px;
      margin-left: 1px;
      content: url(/img/external-link.svg);
    }

    .anchor {
      margin-left: -24px;
    }

    li {
      margin: 16px 0;
    }

    pre[class*='language-'] {
      background: #40354d;
      color: #ccc;

      .token.line {
        color: #ddd;
      }

      .token.comment,
      .token.block-comment {
        font-weight: normal;
        color: #a0a0a0;
      }

      .token.input {
        user-select: none;
      }

      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #999;
      }

      .token.url,
      .token.constant,
      .token.operator,
      .token.punctuation {
        color: #a0a0a0;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.function-name,
      .token.symbol,
      .token.deleted {
        color: #4badd2;
      }

      .token.function {
        color: #ae41bb;
      }

      .token.number,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #219161;
      }

      .token.entity,
      .token.variable {
        color: #a67f59;
      }

      .token.class-name {
        color: #0086b3;
      }

      .token.dvc {
        color: #56b1d0;
        font-weight: bold;
      }

      .token.usage,
      .token.git {
        color: #e9836e;
      }

      .token.command,
      .token.selector,
      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #e4b872;
      }

      .token.regex,
      .token.important {
        color: #b68;
      }

      .token.parameter {
        color: #a0a0a0;
      }

      .token.function-variable {
        color: #7ece42;
      }

      .token.important {
        font-weight: normal;
      }

      .token.bold {
        font-weight: bold;
      }

      .token.italic {
        font-style: italic;
      }

      .token.entity {
        cursor: help;
      }

      .token.namespace {
        opacity: 0.7;
      }
    }
  }

  .Collapsible {
    margin-bottom: 10px;
    background-color: rgba(36, 173, 197, 0.2);
    border-radius: 15px;
    -moz-border-radius: 15px;
    padding: 10px;
  }

  .Collapsible__trigger {
    font-family: BrandonGrotesque;
    font-weight: 500;
    display: block;
    position: relative;
    opacity: 0.9;
    cursor: pointer;

    &:after {
      position: absolute;
      display: inline-block;
      background-size: 20px 20px;
      right: 0;
      width: 20px;
      height: 20px;
      background-image: url('/img/click.png');
      content: '';
      font-family: monospace;
      transition: transform 200ms;
    }

    &.is-open {
      &:after {
        opacity: 0.5;
      }
    }
  }

  .Collapsible__contentInner {
    background-color: rgba(36, 173, 197, 0);
    border-radius: 15px;
    -moz-border-radius: 15px;
    padding: 10px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  details p {
    font-size: 17px;
    color: #454e53;
    margin-left: 20px;
    margin-right: 10px;
  }

  details pre {
    font-size: 14px;
    color: #454e53;
    margin-left: 20px;
    margin-right: 10px;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  font-weight: 600;
  font-size: 14px;
`

export const Button = styled.a`
  text-decoration: none;
  background: white;
  padding: 10px 15px;
  text-transform: uppercase;
  color: #333;
  border-bottom: 3px solid #13adc7;
  display: inline-flex;
  align-items: center;
  transition: 0.2s border-color ease-out;

  &:hover {
    border-bottom: 3px solid #11849b;
  }

  i {
    display: inline-block;
    background-image: url(/img/arrow.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 1em;
    height: 1em;
    line-height: 1;
    transition: all 0.3s;

    &.next {
      margin-left: 7px;
    }

    &.prev {
      margin-right: 7px;
      mask-position: center;
      transform: rotate(180deg);
      margin-top: 2px;
    }
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`

export const TutorialsWrapper = styled.div`
  position: relative;
  z-index: 1;
  float: right;
  margin: 5px 0 0 10px;

  ${media.tablet`
    margin: 0 0 15px 0;
  `}

  @media only screen and (min-width: 1200px) {
    display: none;
  }
`

export const GithubLink = styled(LightButton)`
  display: none;
  float: right;
  margin: 5px 0 10px 10px;
  z-index: 1;
  position: relative;

  ${media.tablet`
    float: none;
    margin: 0 0 15px 0;
  `};

  @media only screen and (max-width: 1200px) {
    display: inline-flex;
  }

  i {
    background-image: url(/img/github_icon.svg);
  }
`

export const ExternalLink = styled.a`
  &:after {
    position: relative;
    top: 1px;
    right: 0;
    width: 12px;
    height: 12px;
    margin-left: 1px;
    content: url(/img/external-link.svg);
  }
`
