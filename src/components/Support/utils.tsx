export type FormField =
  | 'name'
  | 'company'
  | 'email'
  | 'teamSize'
  | 'message'
  | 'purpose'
  | 'areaOfInterest'
  | 'phone'

export type FromErrors = Record<FormField, string>

export type FormValues = Record<FormField, string>

export const emptyValues: FormValues = {
  purpose: '',
  areaOfInterest: '',
  phone: '',
  name: '',
  company: '',
  email: '',
  teamSize: '',
  message: ''
}

export const defaultValues: FormValues = {
  ...emptyValues,
  purpose: 'Request a quote',
  areaOfInterest: 'Expertise and Services',
  teamSize: '1-10'
}

export const teamSize = [`1-10`, `11-50`, `51-100`, `101-500`, `500+`] as const

export const checkErrors = (
  values: FormValues,
  errors: FromErrors
): { hasError: boolean; newErrors: FromErrors } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  let hasError = false
  const newErrors = { ...errors }

  if (!values.name) {
    newErrors.name = 'Full Name is required'
    hasError = true
  } else if (values.name.length < 3) {
    newErrors.name = 'Full Name is too short'
    hasError = true
  } else {
    newErrors.name = ''
  }

  if (!values.company) {
    newErrors.company = 'Company is required'
    hasError = true
  } else if (values.company.length < 3) {
    newErrors.company = 'Company is too short'
    hasError = true
  } else {
    newErrors.company = ''
  }

  if (!values.email) {
    newErrors.email = 'Email is required'
    hasError = true
  } else if (!emailRegex.test(values.email)) {
    newErrors.email = 'Email is not valid'
    hasError = true
  } else {
    newErrors.email = ''
  }

  if (!values.teamSize) {
    newErrors.teamSize = 'Team Size is required'
    hasError = true
  } else {
    newErrors.teamSize = ''
  }

  if (!values.message) {
    newErrors.message = 'Message is required'
    hasError = true
  } else if (values.message.length < 10) {
    newErrors.message = 'Message is too short'
    hasError = true
  } else {
    newErrors.message = ''
  }

  return { hasError, newErrors }
}
