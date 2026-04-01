"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/schemas/checkout.schema"

const defaultValues: CheckoutFormData = {
  customerName: "",
  phone: "",
  address: "",
  note: undefined,
}

export function useCheckoutForm() {
  return useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues,
  })
}
