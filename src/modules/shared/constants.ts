import { TableColumn } from "@components/DataTable.vue"
import { TEvent } from "./types"
import { formatCurrency } from "@/utils/format-currency"

export const EVENT_COLUMN: TableColumn<TEvent>[] = [
  { header: "Event name", accessor: "title" },
  { header: "Price", accessor: "price", cell: ({ value }) => formatCurrency(value as number) },
  { header: "Merchants", accessor: "merchants" },
  { header: "Revenue", accessor: "revenue", cell: ({ value }) => formatCurrency(value as number) },
  {
    header: "Start Date",
    accessor: "start",
    cell: ({ value }) => (value as Date).toLocaleDateString("en-GB"),
  },
  {
    header: "End Date",
    accessor: "end",
    cell: ({ value }) => (value as Date).toLocaleDateString("en-GB"),
  },
  { header: "", accessor: "action" },
]

export const EVENTS: TEvent[] = [
  {
    id: 1,
    title: "Event 1",
    start: new Date("2023-01-01"),
    end: new Date("2023-01-02"),
    location: "Location 1",
    description: "Description 1",
    price: 100,
    merchants: 5,
    revenue: 500,
  },
  {
    id: 2,
    title: "Event 2",
    start: new Date("2023-01-03"),
    end: new Date("2023-01-04"),
    location: "Location 2",
    description: "Description 2",
    price: 150,
    merchants: 10,
    revenue: 1500,
  },
  {
    id: 3,
    title: "Event 3",
    start: new Date("2023-01-05"),
    end: new Date("2023-01-06"),
    location: "Location 3",
    description: "Description 3",
    price: 200,
    merchants: 8,
    revenue: 1600,
  },
  {
    id: 4,
    title: "Event 4",
    start: new Date("2023-01-07"),
    end: new Date("2023-01-08"),
    location: "Location 4",
    description: "Description 4",
    price: 250,
    merchants: 12,
    revenue: 3000,
  },
  {
    id: 5,
    title: "Event 5",
    start: new Date("2023-01-09"),
    end: new Date("2023-01-10"),
    location: "Location 5",
    description: "Description 5",
    price: 300,
    merchants: 15,
    revenue: 4500,
  },
]
