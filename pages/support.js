import React from 'react'
import styled from 'styled-components'
import color from 'color'

// nextjs
import Head from 'next/head'

import { container } from '../src/styles'
import { media } from '../src/styles'

import Page from '../src/Page'
import Hero from '../src/Hero'
import TrySection from '../src/TrySection'
import Popover from '../src/Popover/Popover';

const HeadInjector = () => (
  <Head>
    <title>Support | Data Science Version Control System</title>
  </Head>
);

export default () => (
  <Page stickHeader>
    <HeadInjector />
    <Hero>
      <SupportHero>
        <Heading>
          Questions, feedback, or just need to get in touch?
        </Heading>
      </SupportHero>
    </Hero>

    <Container>
      <Features>
        <Feature>
          <FeatureHeading>
            <Icon url="/static/img/support/chat.svg" color="#945dd6" />
            <Name>Slack-like Chat</Name>
          </FeatureHeading>
          <Description>
            Join data science practitioners in our welcoming DVC community.
            It’s the fastest way to ask for a help.
          </Description>
          <FlexRow>
            <Link href="/chat" target="_blank">
              <Button color="#945dd6">Discord Chat</Button>
            </Link>
            <Popover
              body={<iframe src="https://discordapp.com/widget?id=485586884165107732&theme=light" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>}
              enterExitTransitionDurationMs={200}
            >
              <DiscrodWidget />
            </Popover>
          </FlexRow>
        </Feature>

        <Feature>
          <FeatureHeading>
            <Icon url="/static/img/support/bug.svg" color="#13adc7" />
            <Name>Bugs & Features</Name>
          </FeatureHeading>
          <Description>
            Found an issue or have an idea? Check our github issues tracker
            to see if there is already a fix or report a new one.
          </Description>
          <Link href="https://github.com/iterative/dvc.org/issues" target="_blank">
            <Button color="#13adc7">Open GitHub</Button>
          </Link>
        </Feature>

        <Feature>
          <FeatureHeading>
            <Icon url="/static/img/support/forum.svg" color="#f46837" />
            <Name>Forum</Name>
          </FeatureHeading>
          <Description>
            Discuss your ideas or best practices in the DVC forum.
          </Description>
          <Link href="https://discuss.dvc.org" target="_blank">
            <Button color="#f46837">Go To Forum</Button>
          </Link>
        </Feature>

        <Feature>
          <FeatureHeading>
            <Icon url="/static/img/support/email.svg" color="#945dd6" />
            <Name>Email</Name>
          </FeatureHeading>
          <Description>
            Don’t hesitate to shoot us an email at support@dvc.org for any
            questions. We are very responsive.
          </Description>
          <Link href="mailto:support@dvc.org">
            <Button color="#945dd6">Drop Us a Line</Button>
          </Link>
        </Feature>

      </Features>
    </Container>

    <TrySection
      title="Don't know where to start?"
      buttonText="Get Started"
    />
  </Page>
)

const Container = styled.div`
  ${container};
`

const SupportHero = styled.div`
  padding-top: 90px;
  padding-bottom: 80px;
  overflow: hidden;
`

const Heading = styled.h1`
  font-family: BrandonGrotesqueMed;
  margin: 0px auto;
  max-width: 610px;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  color: #40364d;
`

const Features = styled.div`
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

const Feature = styled.div`
  flex: 1 0 300px;
  margin: 0 20px 60px;
  padding: 10px;
`

const FeatureHeading = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const Icon = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${props => color(props.color).alpha(0.15).string()};
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
const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

const DiscrodWidget = styled.img`
  display: block;
  margin-top: 20px;
  margin-left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  mask-image: url("/static/img/support/discord.svg");
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: #b88eeb;

  &:hover {
    opacity: .7;
  }
`

const Name = styled.h3`
  font-family: BrandonGrotesqueMed;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 500;
  color: #40364d;
  min-height: 28px;
`

const Description = styled.div`
  font-size: 20px;
  color: #5f6c72;
`

const Button = styled.button`
  text-decoration: none;
  margin-top: 20px;
  border-radius: 4px;
  background-color: white;
  border: 2px solid ${(props) => props.color};
  color: ${(props) => props.color};
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  height: 42px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
  padding: 5px 20px;
  
  &:hover {
    background-color: ${(props) => props.color};
    color: white;
  }
`

const Link = styled.a`
  text-decoration: none;
`
