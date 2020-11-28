import { format } from "date-fns"

function formatDocumentDate(date: Date): string {
  return format(date, "MMMM Mo yyyy")
}

const d = new Date("01-22-20")

formatDocumentDate(d) //?
