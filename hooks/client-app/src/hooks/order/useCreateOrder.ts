"use client"

import { useMutation } from "@tanstack/react-query"

import { createOrder, type CreateOrderBody, type Order } from "@/api/orders"

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (
      body: CreateOrderBody,
    ): Promise<{ message: string; data: Order }> => {
      const res = await createOrder(body)
      return res
    },
  })
}

