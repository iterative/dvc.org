import { Dispatch, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../base/dialog'
import RequestAQuoteForm from './RequestAQuoteForm'

const noop = () => {}

const RequestAQuoteDialog = ({
  openDialog,
  setOpenDialog
}: {
  openDialog: boolean
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [pauseDialog, setPauseDialog] = useState(false)
  const title = 'Request a Quote'
  const description =
    "Fill out the form below and we'll reach out to find a time that works for you!"

  return (
    <Dialog open={openDialog} onOpenChange={pauseDialog ? noop : setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="px-1 py-4">
          <RequestAQuoteForm
            setOpenDialog={setOpenDialog}
            setPauseDialog={setPauseDialog}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RequestAQuoteDialog
