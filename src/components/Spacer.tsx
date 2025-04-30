import { cn } from '@/utils'

const Spacer = ({ className }: { className?: string }) => {
  return <div className={cn(`h-px w-full py-5 md:py-10`, className)}></div>
}

export default Spacer
