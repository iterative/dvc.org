import React from 'react'

import Page from '../Page'
import Hero from '../Hero'
import TrySection from '../TrySection'
import Popover from '../Popover'

import { Mark, OnlyDesktop } from '../../styles'

import {
  Button,
  Container,
  Description,
  DiscrodWidget,
  Feature,
  Features,
  FeatureHeading,
  FlexRow,
  Heading,
  Icon,
  Link,
  Name,
  SupportHero
} from './styles'

export default function SupportPage() {
  return (
    <Page stickHeader>
      <Hero>
        <SupportHero>
          <Heading>Questions, feedback, or just need to get in touch?</Heading>
        </SupportHero>
      </Hero>
      <Container>
        <Features>
          <Feature>
            <FeatureHeading>
              <Icon url="/img/support/chat.svg" color="#945dd6" />
              <Name>Slack-like Chat</Name>
            </FeatureHeading>
            <Description>
              Join data science practitioners in our welcoming{' '}
              <Mark text={'#945dd6'} bg={'#FFFFFF'}>
                DVC community
              </Mark>
              . It’s the fastest way to ask for a help.
            </Description>
            <FlexRow>
              <Link href="/chat" target="_blank">
                <Button color="#945dd6">Discord Chat</Button>
              </Link>
              <OnlyDesktop>
                <Popover
                  body={
                    <iframe
                      title="Discord Members Online"
                      src="https://discordapp.com/widget?id=485586884165107732&theme=light"
                      width="350"
                      height="500"
                      allowTransparency="true"
                      frameBorder="0"
                    />
                  }
                  enterExitTransitionDurationMs={200}
                >
                  <DiscrodWidget />
                </Popover>
              </OnlyDesktop>
            </FlexRow>
          </Feature>
          <Feature>
            <FeatureHeading>
              <Icon url="/img/support/bug.svg" color="#13adc7" />
              <Name>Bugs & Features</Name>
            </FeatureHeading>
            <Description>
              Found an issue or have an idea? Check our GitHub{' '}
              <Mark text={'#13adc7'} bg={'#FFFFFF'}>
                issues tracker
              </Mark>{' '}
              to see if there is already a fix or report a new one.
            </Description>
            <Link
              href="https://github.com/iterative/dvc/issues"
              target="_blank"
            >
              <Button color="#13adc7">Open GitHub</Button>
            </Link>
          </Feature>
          <Feature>
            <FeatureHeading>
              <Icon url="/img/support/forum.svg" color="#f46837" />
              <Name>Forum</Name>
            </FeatureHeading>
            <Description>
              Discuss your ideas or{' '}
              <Mark text={'#f46837'} bg={'#FFFFFF'}>
                best practices
              </Mark>{' '}
              in the DVC forum.
            </Description>
            <Link href="https://discuss.dvc.org" target="_blank">
              <Button color="#f46837">Go To Forum</Button>
            </Link>
          </Feature>
          <Feature>
            <FeatureHeading>
              <Icon url="/img/support/email.svg" color="#945dd6" />
              <Name>Email</Name>
            </FeatureHeading>
            <Description>
              Don’t hesitate to shoot us an email at{' '}
              <Link href="mailto:support@dvc.org">
                <Mark text={'#945dd6'} bg={'#FFFFFF'}>
                  support@dvc.org
                </Mark>
              </Link>{' '}
              with any questions.
            </Description>
            <Link href="mailto:support@dvc.org">
              <Button color="#945dd6">Drop Us a Line</Button>
            </Link>
          </Feature>
        </Features>
      </Container>
      <TrySection title="Don't know where to start?" buttonText="Get Started" />
    </Page>
  )
}
