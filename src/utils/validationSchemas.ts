import * as yup from "yup"

export const passwordSchema = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .required("Password is required")

export const createEventSchema = yup.object({
  event_name: yup
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name must not exceed 100 characters")
    .required("Event name is required"),

  startDate: yup
    .date()
    .min(new Date(), "Start date must be in the future")
    .required("Start date is required"),

  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),

  venueAddress: yup
    .string()
    .min(10, "Venue address must be at least 10 characters")
    .required("Venue address is required"),

  registrationCost: yup
    .number()
    .min(0, "Registration cost cannot be negative")
    .required("Registration cost is required"),

  capacity: yup
    .number()
    .min(1, "Maximum attendees must be at least 1")
    .max(10000, "Maximum attendees cannot exceed 10,000")
    .required("Maximum attendees is required"),

  description: yup.string().max(1000, "Description must not exceed 1000 characters"),

  // eventInstructions: yup.string().max(2000, "Instructions must not exceed 2000 characters"),

  // terms: yup
  //   .mixed()
  //   .test("fileSize", "File size must not exceed 2MB", function (value) {
  //     if (!value) return true
  //     const file = value as File
  //     return file.size <= 2 * 1024 * 1024
  //   })
  //   .test("fileType", "Only PDF and image files are allowed", function (value) {
  //     if (!value) return true
  //     const file = value as File
  //     const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]
  //     return allowedTypes.includes(file.type)
  //   }),

  // externalLink: yup.string().url("Please enter a valid URL").nullable(),
})
