import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '../components/MainLayout'
import Typeform from '../components/Typeform'

const EnterpriseTypeform = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <Typeform
      url="https://iterative-ai.typeform.com/to/xGTxcID7"
      title="Enterprise Form"
    />
  </MainLayout>
)

export default EnterpriseTypeform
