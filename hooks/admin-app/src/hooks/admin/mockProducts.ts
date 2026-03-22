export type AdminProductBase = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: "Visible" | "Hidden"
}

export const initialProductsData: AdminProductBase[] = [
  {
    id: "P001",
    name: "Loa JBL CV1652T",
    sku: "JBL-CV1652T",
    category: "Loa Karaoke",
    price: "23.100.000đ",
    stock: 12,
    status: "Visible",
  },
  {
    id: "P002",
    name: "Micro BIK BJ-U25",
    sku: "BIK-U25",
    category: "Micro",
    price: "3.290.000đ",
    stock: 40,
    status: "Visible",
  },
  {
    id: "P003",
    name: "Vang Số JBL KX190",
    sku: "JBL-KX190",
    category: "Vang Số",
    price: "9.900.000đ",
    stock: 15,
    status: "Visible",
  },
  {
    id: "P004",
    name: "Cục Đẩy Crown XLi 2500",
    sku: "CR-XLI2500",
    category: "Cục Đẩy",
    price: "12.500.000đ",
    stock: 9,
    status: "Hidden",
  },
  {
    id: "P005",
    name: "Loa BIK BJ-S888II",
    sku: "BIK-S888II",
    category: "Loa Karaoke",
    price: "8.290.000đ",
    stock: 26,
    status: "Visible",
  },
]
