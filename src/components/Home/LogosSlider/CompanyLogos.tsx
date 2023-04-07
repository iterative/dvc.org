import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

const logoClass =
  'flex items-center mr-10 md:mr-16 opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out'
const logoImageClass = 'grayscale hover:grayscale-0'
const logoImageClassInverted = `${logoImageClass} invert`

const sm = 80
const md = 150
const lg = 200
const xl = 300

const CompanyLogos = () => {
  return (
    <>
      <div className={logoClass}>
        <StaticImage
          src="./logos/aicon.svg"
          alt="Aicon logo"
          width={sm}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/billie.svg"
          alt="Billie logo"
          width={sm}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/cyclica.png"
          alt="Cyclica logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/degould.png"
          alt="Degould logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClassInverted}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/huggingface.svg"
          alt="Huggingface logo"
          width={xl}
          layout="fixed"
          loading="eager"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/inlab-digital.svg"
          alt="Inlab Digital logo"
          width={md}
          layout="fixed"
          loading="eager"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/mantis.svg"
          alt="Mantis logo"
          width={lg}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/papercup.png"
          alt="Papercup logo"
          width={lg}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/pieces.png"
          alt="Pieces logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClassInverted}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/plasmasolve.png"
          alt="Plasmasolve logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClassInverted}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/sicara.png"
          alt="Sicara logo"
          width={sm}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/ubs.png"
          alt="UBS logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClassInverted}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/ukho.png"
          alt="UKHO logo"
          width={md}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClassInverted}
        />
      </div>
      <div className={logoClass}>
        <StaticImage
          src="./logos/xp-inc-new.webp"
          alt="XP Inc logo"
          width={lg}
          loading="eager"
          layout="fixed"
          objectFit="contain"
          className={logoImageClass}
        />
      </div>
    </>
  )
}

export default CompanyLogos
