import React, { useEffect, useRef } from 'react'
import { Label } from '../base/label'
import { Input } from '../base/input'
import { Select } from '../base/select'
import { Textarea } from '../base/textarea'
import Button from '../base/button'
import { cn } from '../../utils'
import { Loader2Icon } from 'lucide-react'
import { getHubSpotFormUrl } from '../../utils/externalUrls'
import {
  FormField,
  FromErrors,
  checkErrors,
  defaultValues,
  emptyValues,
  teamSize
} from './utils'

const ErrorMessage = ({
  name,
  errors
}: {
  name: FormField
  errors: FromErrors
}) => {
  if (!errors[name]) return null
  return (
    <p className="text-red-500 text-sm" id={`${name}-error`}>
      {errors[name]}
    </p>
  )
}

const RequiredField = () => (
  <span className="text-red-500" aria-hidden="true">
    *
  </span>
)

const RequestAQuoteForm = ({
  setOpenDialog,
  setPauseDialog
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setPauseDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [values, setValues] = React.useState(defaultValues)

  const abortControllerRef = useRef<AbortController | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const [errors, setErrors] = React.useState<FromErrors>({
    name: '',
    company: '',
    email: '',
    teamSize: '',
    message: '',
    purpose: '',
    areaOfInterest: '',
    phone: ''
  })

  const [error, setError] = React.useState<string>('')
  const [success, setSuccess] = React.useState(false)

  useEffect(() => {
    return () => {
      // Cleanup function to abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (submitting) {
      setPauseDialog(true)
    } else {
      setPauseDialog(false)
    }
  }, [submitting])

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const newAbortController = new AbortController()

    abortControllerRef.current = newAbortController

    setError('')
    setSubmitting(true)

    const { hasError, newErrors } = checkErrors(values, errors)

    setErrors(newErrors)

    if (hasError) {
      setSubmitting(false)
      return
    }

    try {
      const formId = `50ebdb54-825e-436f-9afc-6c6fa4b2d865`
      /**
       * NOTE: For Testing, simply call getHubSpotFormUrl() i.e without parameters
       * it defaults to test form id
       */
      const response = await fetch(getHubSpotFormUrl({ formId }), {
        method: `POST`,
        headers: {
          'Content-Type': `application/json`
        },
        body: JSON.stringify({
          fields: [
            {
              objectTypeId: `0-1`,
              name: `full_name`,
              value: values.name
            },
            {
              objectTypeId: `0-1`,
              name: `company`,
              value: values.company
            },
            {
              objectTypeId: `0-1`,
              name: `email`,
              value: values.email
            },
            {
              objectTypeId: `0-1`,
              name: `team_size`,
              value: values.teamSize
            },
            {
              objectTypeId: `0-1`,
              name: `area_of_interest`,
              value: values.areaOfInterest
            },
            {
              objectTypeId: `0-1`,
              name: `phone`,
              value: values.phone
            },
            {
              objectTypeId: `0-1`,
              name: `message`,
              value: values.message
            },
            {
              objectTypeId: `0-1`,
              name: `purpose`,
              value: values.purpose
            }
          ],
          context: {
            pageName: `Platinum Services (Request a Quote)`,
            pageUri: `https://dvc.org/support`
          }
        }),
        signal: newAbortController.signal
      })
      const data = await response.json()
      if (data.status === `error`) throw new Error(data)

      setSubmitting(false)
      setValues(defaultValues)
      setErrors(emptyValues)
      setSuccess(true)
    } catch (error: unknown) {
      if ((error as Error)?.name !== 'AbortError') {
        setError('Something went wrong. Please try again later.')
        setSubmitting(false)
        return
      }
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-green-500">Form submitted successfully!</p>
          <p className="text-green-500">
            Thank you for your interest. We will get back to you shortly.
          </p>
        </div>

        <Button
          className={cn('w-full', 'bg-blue hover:bg-blue-hover', 'text-base')}
          onClick={() => setOpenDialog(false)}
        >
          Close
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} method="post" className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">
          Full Name <RequiredField />
        </Label>
        <Input name="name" id="name" value={values.name} onChange={onChange} />
        <ErrorMessage name="name" errors={errors} />
      </div>
      <div>
        <Label htmlFor="company">
          Company <RequiredField />
        </Label>
        <Input
          name="company"
          id="company"
          value={values.company}
          onChange={onChange}
        />
        <ErrorMessage name="company" errors={errors} />
      </div>
      <div>
        <Label htmlFor="email">
          Business Email <RequiredField />
        </Label>
        <Input
          name="email"
          id="email"
          value={values.email}
          onChange={onChange}
        />
        <ErrorMessage name="email" errors={errors} />
      </div>
      <div>
        <Label htmlFor="teamSize">Team Size</Label>
        <Select
          name="teamSize"
          id="teamSize"
          value={values.teamSize}
          onChange={onChange}
        >
          {teamSize.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </Select>
        <ErrorMessage name="teamSize" errors={errors} />
      </div>
      <div>
        <Label htmlFor="message">How we can help?</Label>
        <Textarea
          name="message"
          id="message"
          value={values.message}
          onChange={onChange}
        />
        <ErrorMessage name="message" errors={errors} />
      </div>

      <div>
        <Button
          className={cn('w-full', 'bg-blue hover:bg-blue-hover', 'text-base')}
          type="submit"
          disabled={submitting}
        >
          Submit
          {submitting && <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
        {error && (
          <p className="mt-2 text-center text-red-500 text-sm">{error}</p>
        )}
      </div>
    </form>
  )
}

export default RequestAQuoteForm
