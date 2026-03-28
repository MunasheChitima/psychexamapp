import { redirect } from 'next/navigation'
import { getExamSuite } from '@/lib/examSuite'

export default function NursingEntryPage() {
  if (getExamSuite() === 'nursing') {
    redirect('/')
  }
  redirect('/nursing/dashboard')
}
