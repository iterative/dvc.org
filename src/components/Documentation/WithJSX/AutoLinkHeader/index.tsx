import React from 'react'

interface IHeaderProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  headerAttributes?: object
}

const Header: React.FC<IHeaderProps> = ({
  children,
  level,
  headerAttributes
}) => {
  switch (level) {
    case 6:
      return <h6 {...headerAttributes}>{children}</h6>
    case 5:
      return <h5 {...headerAttributes}>{children}</h5>
    case 4:
      return <h4 {...headerAttributes}>{children}</h4>
    case 3:
      return <h3 {...headerAttributes}>{children}</h3>
    case 2:
      return <h2 {...headerAttributes}>{children}</h2>
    default:
      return <h1 {...headerAttributes}>{children}</h1>
  }
}

interface IAutoLinkHeaderProps {
  id: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const AutoLinkHeader: React.FC<IAutoLinkHeaderProps> = ({
  children,
  id,
  level
}) => {
  return (
    <Header
      level={level}
      headerAttributes={{ id, style: { position: 'relative' } }}
    >
      {children}
      <a
        href={`#${id}`}
        aria-label={`${id.replace(/-/g, ' ')} permalink`}
        className="anchor after"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          height="16"
          version="1.1"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            fillRule="evenodd"
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
          ></path>
        </svg>
      </a>
    </Header>
  )
}

export default AutoLinkHeader
