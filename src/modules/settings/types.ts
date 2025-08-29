export type TLocation = {
  id: number
  name: string
  address: string
  phone: string
  membersCount: number
  status: "Active" | "Archived"
}

export type TLocationFormData = {
  name: string
  address: string
}

export type TTeam = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: "Admin" | "Member"
  status: "Active" | "Invited" | "Inactive"
  locations: TLocation[]
}
