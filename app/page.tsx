"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [])

  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(autoplay)
  }, [emblaApi])

  const howItWorksSteps = [
    {
      number: 1,
      title: "Register",
      description: "Create an account with your student ID and complete facial recognition setup.",
    },
    {
      number: 2,
      title: "Login",
      description: "Access the system using facial recognition to verify your identity.",
    },
    {
      number: 3,
      title: "Vote",
      description: "Cast your vote in active elections after final facial verification.",
    },
  ]

  return (
    <div className="relative overflow-y-auto">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/picture 1.png')`,
        }}
      >
        <div className="absolute inset-0 bg-[#003B71] opacity-70"></div>{/* Blue overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">University of Rwanda Voting System</h1>
          <p className="max-w-2xl mx-auto">
            Welcome to the official voting platform for University of Rwanda. This secure system uses facial recognition
            to ensure the integrity of all votes.
          </p>
        </div>

        {/* How It Works Slider */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>{/* Removed text-[#003B71] to inherit white color */}
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {howItWorksSteps.map((step) => (
                <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4" key={step.number}>{/* Added flex basis for responsiveness and horizontal padding */}
                  {/* Step Content - No Card Background */}
                  <div className="text-center">
                    <div className="bg-[#003B71] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">{/* Reduced size */}
                      {step.number}
                    </div>
                    <h3 className="font-medium mb-1 text-lg">{step.title}</h3>{/* Adjusted text size */}
                    <p className="text-sm text-gray-200">{step.description}</p>{/* Adjusted text color for contrast */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Existing Cards (size reduced)*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white bg-opacity-80 text-[#003B71]">
            <CardHeader className="p-4 pb-0">{/* Reduced padding */}
              <CardTitle className="text-[#003B71] text-lg">Register to Vote</CardTitle>{/* Reduced text size */}
              <CardDescription className="text-gray-700 text-sm">Create your account with facial verification</CardDescription>{/* Reduced text size */}
            </CardHeader>
            <CardContent className="p-4 pt-2">{/* Reduced padding */}
              <p className="mb-4 text-gray-800 text-sm">New users must register with their student ID and complete facial recognition setup.</p>{/* Reduced text size */}
              <Button className="w-full bg-[#003B71] hover:bg-[#002a52] text-white text-sm">{/* Reduced text size */}
                <Link href="/register">Register Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-80 text-[#003B71]">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-[#003B71] text-lg">Login</CardTitle>
              <CardDescription className="text-gray-700 text-sm">Access your voting account</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="mb-4 text-gray-800 text-sm">Already registered? Login with facial verification to access your voting dashboard.</p>
              <Button asChild className="w-full bg-[#003B71] hover:bg-[#002a52] text-white text-sm">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-80 text-[#003B71]">
            <CardHeader className="p-4 pb-0">{/* Reduced padding */}
              <CardTitle className="text-[#003B71] text-lg">Current Elections</CardTitle>{/* Reduced text size */}
              <CardDescription className="text-gray-700 text-sm">View active and upcoming elections</CardDescription>{/* Reduced text size */}
            </CardHeader>
            <CardContent className="p-4 pt-2">{/* Reduced padding */}
              <p className="mb-4 text-gray-800 text-sm">See all active elections and upcoming voting opportunities at the University.</p>{/* Reduced text size */}
              <Button className="w-full bg-[#003B71] hover:bg-[#002a52] text-white text-sm">{/* Reduced text size */}
                <Link href="/login">View Elections</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Original How It Works section removed */}

      </div>
    </div>
  )
}
