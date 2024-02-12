import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '../components/MainLayout'

import Home from '../components/Home'

const HomePage = ({ location }: PageProps) => (
  <MainLayout
    location={location}
    className="mt-14 bg-gradient-126 from-[#DAFAFF] via-[#ECDEFF] to-[#FFF3EF]"
  >
    <Home />
  </MainLayout>
)

export default HomePage
