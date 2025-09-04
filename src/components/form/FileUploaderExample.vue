<template>
  <div class="mx-auto max-w-md space-y-6 p-6">
    <h2 class="text-core-800 text-xl font-semibold">File Uploader Examples</h2>

    <!-- Direct FileUploader Usage -->
    <div class="space-y-4">
      <h3 class="text-core-700 text-lg font-medium">Direct Usage</h3>
      <FileUploader
        v-model="directFile"
        label="Upload Document"
        :required="true"
        accept="image/*,.pdf,.doc,.docx"
        :max-size="5"
        placeholder="Select or drop your file here"
        hint="Accepted formats: Images, PDF, Word documents"
      />
      <p v-if="directFile" class="text-core-600 text-sm">Selected file: {{ directFile.name }}</p>
    </div>

    <!-- FormField Integration -->
    <div class="space-y-4">
      <h3 class="text-core-700 text-lg font-medium">FormField Integration</h3>
      <Form @submit="handleSubmit" :validation-schema="validationSchema">
        <div class="space-y-4">
          <FormField
            name="profilePicture"
            type="file"
            label="Profile Picture"
            :required="true"
            accept="image/*"
            :max-size="2"
            placeholder="Upload your profile picture"
            hint="Max size: 2MB, Images only"
          />

          <FormField
            name="resume"
            type="file"
            label="Resume/CV"
            accept=".pdf,.doc,.docx"
            placeholder="Upload your resume"
            hint="PDF or Word document preferred"
          />

          <button
            type="submit"
            class="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Form } from "vee-validate"
import * as yup from "yup"
import FileUploader from "./FileUploader.vue"
import FormField from "./FormField.vue"

const directFile = ref<File | null>(null)

const validationSchema = yup.object({
  profilePicture: yup.mixed().required("Profile picture is required"),
  resume: yup.mixed().nullable(),
})

const handleSubmit = (values: unknown) => {
  console.log("Form submitted:", values)
  alert("Form submitted successfully! Check console for values.")
}
</script>
