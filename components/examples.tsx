/**
 * Ví dụ sử dụng components theo Atomic Design Pattern
 * File này chỉ để tham khảo, không được import vào production code
 */

import { Button, Input, Label, Badge } from "@/components/atoms"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/molecules"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms"

// Ví dụ 1: Sử dụng Atoms
export function AtomsExample() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <Button>Click me</Button>
      <Badge>New</Badge>
    </div>
  )
}

// Ví dụ 2: Sử dụng Molecules (kết hợp Atoms)
export function MoleculesExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
        <Button>Action</Button>
      </CardContent>
    </Card>
  )
}

// Ví dụ 3: Sử dụng Organisms (kết hợp Molecules và Atoms)
export function OrganismsExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <Button>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
