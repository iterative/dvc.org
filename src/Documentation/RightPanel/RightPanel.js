import styled from 'styled-components'

export const RightPanel = ({ headings, scrollToLink, githubLink }) => (
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
          onClick={() => scrollToLink('#' + slug)}
          href={`#${slug}`}
        >
          {text}
        </HeadingLink>
      ))}

    <br />

    <Link href={githubLink} target="_blank">
      <HollowButton color="#13adc7">Edit on Github</HollowButton>
    </Link>

    <Link href="/chat" target="_blank">
      <HollowButton color="#945dd6">Discord Chat</HollowButton>
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

  @media only screen and (max-width: 1170px) {
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
  margin-top: 30px;
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

const HollowButton = styled.button`
  width: 100%;
  text-align: center;
  text-decoration: none;
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: white;
  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  height: 40px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
  text-transform: uppercase;

  &:hover {
    background-color: ${props => props.color};
    color: white;
  }
`

const Link = styled.a`
  text-decoration: none;
`

const Spacer = styled.div`
  height: 65px;
`
