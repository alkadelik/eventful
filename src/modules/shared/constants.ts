import { TableColumn } from "@components/DataTable.vue"
import { TEvent } from "./types"

export const EVENT_COLUMN: TableColumn<TEvent>[] = [
  { header: "Title", accessor: "title" },
  { header: "Start", accessor: "start" },
  { header: "End", accessor: "end" },
  { header: "Location", accessor: "location" },
  { header: "Description", accessor: "description" },
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
  },
  {
    id: 2,
    title: "Event 2",
    start: new Date("2023-01-03"),
    end: new Date("2023-01-04"),
    location: "Location 2",
    description: "Description 2",
  },
  {
    id: 3,
    title: "Event 3",
    start: new Date("2023-01-05"),
    end: new Date("2023-01-06"),
    location: "Location 3",
    description: "Description 3",
  },
  {
    id: 4,
    title: "Event 4",
    start: new Date("2023-01-07"),
    end: new Date("2023-01-08"),
    location: "Location 4",
    description: "Description 4",
  },
  {
    id: 5,
    title: "Event 5",
    start: new Date("2023-01-09"),
    end: new Date("2023-01-10"),
    location: "Location 5",
    description: "Description 5",
  },
]
