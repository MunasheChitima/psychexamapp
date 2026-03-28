import { notFound } from 'next/navigation'

/** Internal target for middleware rewrite when a route belongs to another exam product. */
export default function SuiteNotFoundTrigger() {
  notFound()
}
