import * as yup from "yup"

// Step 0: Event Details validation
export const eventDetailsSchema = yup.object({
  event_name: yup
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name must not exceed 100 characters")
    .required("Event name is required"),

  startDate: yup
    .date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Start date cannot be in the past")
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
    .typeError("Must be a number")
    .min(0, "Registration cost cannot be negative"),

  capacity: yup
    .number()
    .typeError("Must be a number")
    .min(1, "Maximum attendees must be at least 1")
    .max(10000, "Maximum attendees cannot exceed 10,000")
    .required("Maximum attendees is required"),

  description: yup.string().max(1000, "Description must not exceed 1000 characters"),
})

// Step 1: Additional Details validation (all optional)
export const additionalDetailsSchema = yup.object({
  eventInstructions: yup.string().max(2000, "Instructions must not exceed 2000 characters"),

  event_flier: yup
    .mixed()
    .nullable()
    .test("fileSize", "File size must not exceed 2MB", function (value) {
      if (!value) return true
      const file = value as File
      return file.size <= 2 * 1024 * 1024
    })
    .test("fileType", "Only image files are allowed", function (value) {
      if (!value) return true
      const file = value as File
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
      return allowedTypes.includes(file.type)
    }),

  terms_and_conditions: yup
    .mixed()
    .nullable()
    .test("fileSize", "File size must not exceed 2MB", function (value) {
      if (!value) return true
      const file = value as File
      return file.size <= 2 * 1024 * 1024
    })
    .test("fileType", "Only PDF and document files are allowed", function (value) {
      if (!value) return true
      const file = value as File
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      return allowedTypes.includes(file.type)
    }),
})

// Full schema for final submission
export const createEventSchema = eventDetailsSchema.concat(additionalDetailsSchema)
