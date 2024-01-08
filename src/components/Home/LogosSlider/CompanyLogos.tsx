import React from 'react'
import cn from 'classnames'

const logoClass =
  'flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 ease-in-out'
const logoImageClass =
  'h-20 grayscale group-hover:grayscale-0 transition-[filter] duration-300 ease-in-out'
const logoImageClassInverted = `${logoImageClass} invert`

const sm = 'w-16'
const md = 'w-24'
const lg = 'w-32'
const xl = 'w-40'
const xxl = 'w-48'

const logos = [
  {
    name: 'Aicon',
    alt: 'Aicon logo',
    src: 'logos/aicon.svg',
    className: cn(logoClass, sm),
    imageClassName: cn(logoImageClass, 'h-16')
  },
  {
    name: 'Billie',
    alt: 'Billie logo',
    src: 'logos/billie.svg',
    className: cn(logoClass, sm),
    imageClassName: cn(logoImageClass, 'h-16')
  },
  {
    name: 'Cyclica',
    alt: 'Cyclica logo',
    src: 'logos/cyclica.png',
    className: cn(logoClass, lg)
  },
  {
    name: 'Degould',
    alt: 'Degould logo',
    src: 'logos/degould.png',
    className: cn(logoClass, md),
    imageClassName: logoImageClassInverted
  },
  {
    name: 'Huggingface',
    alt: 'Huggingface logo',
    src: 'logos/huggingface.svg',
    className: cn(logoClass, xxl)
  },
  {
    name: 'Inlab Digital',
    alt: 'Inlab Digital logo',
    src: 'logos/inlab-digital.svg',
    className: cn(logoClass, lg)
  },
  {
    name: 'UBS',
    alt: 'UBS logo',
    src: 'logos/ubs.png',
    className: cn(logoClass, xl),
    imageClassName: logoImageClassInverted
  },
  {
    name: 'Mantis',
    alt: 'Mantis logo',
    src: 'logos/mantis.svg',
    className: cn(logoClass, lg)
  },
  {
    name: 'Papercup',
    alt: 'Papercup logo',
    src: 'logos/papercup.png',
    className: cn(logoClass, xl)
  },
  {
    name: 'Pieces',
    alt: 'Pieces logo',
    src: 'logos/pieces.png',
    className: cn(logoClass, md),
    imageClassName: logoImageClassInverted
  },
  {
    name: 'Sicara',
    alt: 'Sicara logo',
    src: 'logos/sicara.png',
    className: cn(logoClass, sm)
  },
  {
    name: 'UKHO',
    alt: 'UKHO logo',
    src: 'logos/ukho.png',
    className: cn(logoClass, lg),
    imageClassName: logoImageClassInverted
  },
  {
    name: 'XP Inc',
    alt: 'XP Inc logo',
    src: 'logos/xp-inc-new.webp',
    className: cn(logoClass, md)
  },
  {
    name: 'Kibsi',
    alt: 'Kibsi logo',
    src: 'logos/kibsi.png',
    className: cn(logoClass, md)
  },
  {
    name: 'Summer Sports',
    alt: 'Summer Sports logo',
    src: 'logos/summer-sports.png',
    className: cn(logoClass, md)
  },
  {
    name: 'Motorway',
    alt: 'Motorway logo',
    src: 'logos/motorway.png',
    className: cn(logoClass, md)
  }
]

const CompanyLogos = () => {
  return (
    <>
      {logos.map((logo, index) => (
        <div key={index} className={logo.className}>
          <img
            src={logo.src}
            alt={logo.alt}
            width={200}
            height={35}
            loading="eager"
            className={logo.imageClassName ?? logoImageClass}
            style={{ color: 'transparent', objectFit: 'contain' }}
          />
        </div>
      ))}
    </>
  )
}

export default CompanyLogos
