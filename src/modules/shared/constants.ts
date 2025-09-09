import { TableColumn } from "@components/DataTable.vue"
import { TEvent, TVendor } from "./types"
import { formatCurrency } from "@/utils/format-currency"

export const EVENT_COLUMN: TableColumn<TEvent>[] = [
  { header: "Event name", accessor: "event_name", class: "font-medium text-core-800" },
  {
    header: "Price",
    accessor: "participant_fee",
    cell: ({ value }) => (value ? formatCurrency(value as number) : "Free"),
  },
  { header: "Merchants", accessor: "merchants" },
  {
    header: "Revenue",
    accessor: "revenue",
    cell: ({ value }) => (value ? formatCurrency(value as number) : "--"),
  },
  {
    header: "Start Date",
    accessor: "start_date",
    cell: ({ value }) => new Date(value as string).toLocaleDateString("en-GB"),
  },
  {
    header: "End Date",
    accessor: "end_date",
    cell: ({ value }) => new Date(value as string).toLocaleDateString("en-GB"),
  },
  { header: "", accessor: "action" },
]

export const VENDORS_COLUMN: TableColumn<TVendor>[] = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone", accessor: "phone" },
]
