function WrongTypeError(type: string) {
  return new Error(`A ${type} cannot be used as input for parseLink!`)
}

function parseLink(input: unknown) {
  switch (typeof input) {
    // Handle shorthand string links
    case `string`: {
      let url
      try {
        url = new URL(
          input.startsWith(`http`)
            ? input
            : `https://` + input.replace(`www.`, ``)
        )
      } catch {
        throw new Error(`Invalid URL: ${input}`)
      }
      let site = null
      let username = null

      if (
        url.hostname.startsWith(`www.`) &&
        !url.hostname.includes(`linkedin.com`)
      ) {
        url.hostname = url.hostname.substring(4)
      }

      if (url.hostname.includes(`twitter.com`)) {
        site = `twitter`
        username = url.pathname.split(`/`)[1]
      } else if (url.hostname.includes(`linkedin.com`)) {
        site = `linkedin`
        if (!url.hostname.startsWith(`www.`)) {
          url.hostname = `www.` + url.hostname
        }
        username = url.pathname.split(`/`)[2]
      } else if (url.hostname.includes(`github.com`)) {
        site = `github`
        username = url.pathname.split(`/`)[1]
      }

      // Convert http to https
      if (url.protocol === `http:`) {
        url.protocol = `https:`
      }

      return {
        site,
        url: url.href.replace(/\/$/, ``),
        username
      }
    }

    // Pass object links through
    case `object`: {
      // typeof null is object, so handle that
      if (input === null) throw WrongTypeError(`null`)
      return input
    }

    // Throw on anything else
    default:
      throw WrongTypeError(typeof input)
  }
}

export default parseLink
