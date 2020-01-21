import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

import { OnlyDesktop, OnlyMobile } from '../../styles'

import { SliderWrapper } from './styles'

const imagesSliderProps = {
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 1,
  adaptiveHeight: true,
  infinite: true,
  autoplay: true,
  speed: 600,
  dots: true,
  arrows: false
}

export default function CommunityCarousel({ items }) {
  return (
    <>
      <OnlyDesktop>{items}</OnlyDesktop>
      <OnlyMobile>
        <SliderWrapper>
          <Slider {...imagesSliderProps}>{items}</Slider>
        </SliderWrapper>
      </OnlyMobile>
    </>
  )
}

CommunityCarousel.propTypes = {
  items: PropTypes.array
}
