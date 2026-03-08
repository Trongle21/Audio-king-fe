"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/schemas/checkout.schema"

const defaultValues: CheckoutFormData = {
  customerType: "anh",
  fullName: "",
  phone: "",
  addressLine: "",
  note: "",
  paymentMethod: "cod",
  agreeTerms: false,
}

export function useCheckoutForm() {
  return useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues,
  })
}
