import styled from 'styled-components'
import { LightButton } from '../LightButton'
import SidebarHelper from '../SidebarMenu/SidebarHelper'

export const RightPanel = ({ headings, githubLink }) => (
  <Wrapper>
    {!!headings.length ? (
      <>
        <Header>Content</Header>
        <hr />
      </>
    ) : (
      <Spacer />
    )}

    {!!headings.length &&
      headings.map(({ text, slug }, headingIndex) => (
        <HeadingLink
          level={3}
          key={`link-${headingIndex}`}
          onClick={() => SidebarHelper.scrollToLink('#' + slug)}
          href={`#${slug}`}
        >
          {text}
        </HeadingLink>
      ))}

    <br />
    <Description>Found an issue? Let us know or fix it:</Description>

    <Link href={githubLink} target="_blank">
      <GithubButton>
        <i />
        Edit on Github
      </GithubButton>
    </Link>

    <br />
    <br />
    <Description>Have a question? Join our chat, we will help you:</Description>

    <Link href="/chat" target="_blank">
      <DiscordButton>
        <i />
        Discord Chat
      </DiscordButton>
    </Link>
  </Wrapper>
)

const Wrapper = styled.div`
  width: 170px;
  min-width: 170px;
  font-size: 16px;
  height: calc(100vh - 78px);
  position: sticky;
  top: 0;

  @media only screen and (max-width: 1200px) {
    display: none;
  }

  hr {
    opacity: 0.5;
  }
`

const Header = styled.p`
  color: #3c3937;
  font-size: 14px;
  text-transform: uppercase;
  margin-top: 56px;
`

const HeadingLink = styled.a`
  display: block;
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #a0a8a5;
  text-decoration: none;
  font-weight: 400;
  line-height: 26px;
  min-height: 26px;
  margin-bottom: 3px;
  cursor: pointer;

  &:hover {
    color: #3c3937;
  }
`

const GithubButton = styled(LightButton)`
  min-width: 120px;
  margin: 10px 0;

  i {
    background-image: url(/static/img/github_icon.svg);
  }
`

const DiscordButton = styled(LightButton)`
  min-width: 120px;
  margin: 10px 0;

  i {
    background-image: url(/static/img/discord.svg);
    width: 1.2em;
    height: 1.2em;
  }
`

const Link = styled.a`
  text-decoration: none;
`

const Spacer = styled.div`
  height: 65px;
`

const Description = styled.p`
  color: #3c3937;
`
