import styled from 'styled-components'

export const RightPanel = ({ headings, scrollToLink }) => (
  <Wrapper>
    <Header>Content</Header>
    <hr />

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
  </Wrapper>
)

const Wrapper = styled.div`
  min-width: 180px;
  margin: 10px;
  font-size: 16px;

  @media only screen and (max-width: 1170px) {
    display: none;
  }
`

const Header = styled.p`
  color: #3c3937;
  font-size: 14px;
  text-transform: uppercase;
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
