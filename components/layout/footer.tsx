import { Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-gray-800 text-white py-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:mb-0">
              <p className="text-sm">© {new Date().getFullYear()} University of Rwanda. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-md border-blue-600 text-white hover:bg-blue-700">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-md border-blue-600 text-white hover:bg-blue-700">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
