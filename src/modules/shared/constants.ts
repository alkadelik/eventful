import { TableColumn } from "@components/DataTable.vue"
import { TDiscountCode, TEvent, TVendor } from "./types"
import { formatCurrency } from "@/utils/format-currency"

export const EVENT_COLUMN: TableColumn<TEvent>[] = [
  { header: "Event name", accessor: "event_name", class: "font-medium text-core-800" },
  {
    header: "Price",
    accessor: "event_fee",
    cell: ({ value }) => (Number(value) ? formatCurrency(value as number) : "Free"),
  },
  { header: "Merchants", accessor: "merchants", cell: ({ item }) => item?.registration_count || 0 },
  {
    header: "Revenue",
    accessor: "revenue",
    cell: ({ item }) =>
      Number(item.event_fee) && item.registration_count
        ? formatCurrency(Number(item.event_fee) * item.registration_count)
        : "--",
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
  { header: "Code", accessor: "code" },
  { header: "Amount Paid", accessor: "amount_paid" },
]

export const CODES_COLUMN: TableColumn<TDiscountCode>[] = [
  { header: "Code", accessor: "code" },
  { header: "Discount", accessor: "amount", cell: ({ value }) => formatCurrency(value as number) },
  { header: "Usage Count", accessor: "times_used" },
  {
    header: "Expiry Date",
    accessor: "expiry_date",
    cell: ({ value }) => (value ? new Date(value as string).toLocaleDateString("en-GB") : "--"),
  },
  { header: "Status", accessor: "status" },
  { header: "", accessor: "action" },
]

export const EXPORT_FIELD_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Code", value: "code" },
  { label: "Amount Paid", value: "amount_paid" },
]

export const EXPORT_PERIOD_OPTIONS = [
  { label: "All", value: "all" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "Last 90 days", value: "last_90_days" },
  { label: "Custom", value: "custom" },
]
