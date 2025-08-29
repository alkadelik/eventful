import { TableColumn } from "@components/DataTable.vue"
import { TLocation, TTeam } from "./types"

export const LOCATION_COLUMNS: TableColumn<TLocation>[] = [
  { header: "Name", accessor: "name" },
  { header: "Address", accessor: "address" },
  { header: "Phone", accessor: "phone" },
  { header: "Status", accessor: "status" },
  { header: "Members", accessor: "membersCount", class: "pl-8" },
  { header: "", accessor: "action" },
]

export const LOCATIONS: TLocation[] = [
  {
    id: 1,
    name: "Headquarters",
    address: "123 Main St",
    phone: "555-1234",
    membersCount: 10,
    status: "Active",
  },
  {
    id: 2,
    name: "Branch Office",
    address: "456 Elm St",
    phone: "555-5678",
    membersCount: 5,
    status: "Archived",
  },
  {
    id: 3,
    name: "Remote Office",
    address: "789 Oak St",
    phone: "555-9012",
    membersCount: 8,
    status: "Active",
  },
  {
    id: 4,
    name: "Warehouse",
    address: "321 Pine St",
    phone: "555-3456",
    membersCount: 3,
    status: "Active",
  },
]

export const TEAMS_COLUMN: TableColumn<TTeam>[] = [
  { header: "Name", accessor: "firstName" },
  {
    header: "Locations",
    accessor: "locations",
    cell: ({ value }) => (value as TLocation[]).map((loc) => loc.name).join(", "),
  },
  { header: "Roles", accessor: "role" },
  { header: "", accessor: "action" },
]

export const TEAMS: TTeam[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    locations: [LOCATIONS[0], LOCATIONS[1]],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "Member",
    status: "Invited",
    locations: [LOCATIONS[1], LOCATIONS[2]],
  },
]
