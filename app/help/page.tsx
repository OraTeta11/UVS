"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // FAQ categories
  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      faqs: [
        {
          question: "What is the University of Rwanda Voting System?",
          answer:
            "The University of Rwanda Voting System is an official platform for conducting secure and transparent elections within the university. It allows students to vote for various positions including student representatives, faculty representatives, and more.",
        },
        {
          question: "Who can use the voting system?",
          answer:
            "All registered students of the University of Rwanda with valid student IDs can use the voting system. Faculty and staff may also use the system for specific elections where they are eligible to vote.",
        },
        {
          question: "How do I access the voting system?",
          answer:
            "You can access the voting system through any web browser on your computer, tablet, or smartphone by visiting the official URL. The system is designed to be responsive and work on all devices.",
        },
      ],
    },
    {
      id: "registration",
      title: "Registration & Login",
      faqs: [
        {
          question: "How do I register for the voting system?",
          answer:
            "To register, click on the 'Register' button on the homepage. You'll need to provide your student ID, name, email, and complete the facial recognition setup for security purposes.",
        },
        {
          question: "Why does the system require facial recognition?",
          answer:
            "Facial recognition is used to ensure the security and integrity of the voting process. It verifies your identity during registration, login, and before submitting votes to prevent fraud and ensure that only eligible individuals can vote.",
        },
        {
          question: "What if I'm having trouble with the facial recognition?",
          answer:
            "Ensure you're in a well-lit area with your face clearly visible. Remove any accessories that might obstruct your face like hats or large glasses. If problems persist, contact the support team through the 'Contact Support' option.",
        },
      ],
    },
    {
      id: "voting",
      title: "Voting Process",
      faqs: [
        {
          question: "How do I vote in an election?",
          answer:
            "To vote, log in to your account, navigate to the 'Elections' section, and select the active election you wish to participate in. Follow the on-screen instructions to select your preferred candidates and submit your vote after facial verification.",
        },
        {
          question: "Can I change my vote after submitting?",
          answer:
            "No, once you've submitted your vote, it cannot be changed. This is to ensure the integrity of the election process. Please review your selections carefully before final submission.",
        },
        {
          question: "How do I know my vote was counted?",
          answer:
            "After successfully submitting your vote, you'll receive a confirmation message. You can also check your voting history in your profile section, which will show all elections you've participated in.",
        },
        {
          question: "Is my vote anonymous?",
          answer:
            "Yes, your vote is completely anonymous. While the system records that you have voted in an election (to prevent double voting), it does not link your identity to your specific voting choices.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Issues",
      faqs: [
        {
          question: "The system is not loading properly. What should I do?",
          answer:
            "Try refreshing your browser, clearing your cache, or using a different browser. Ensure you have a stable internet connection. If the issue persists, contact technical support with details about your device and browser.",
        },
        {
          question: "Is the voting system secure?",
          answer:
            "Yes, the system employs multiple security measures including facial recognition, encrypted data transmission, and secure database storage. All communications are protected with HTTPS, and the system undergoes regular security audits.",
        },
        {
          question: "Can I use the system on my mobile device?",
          answer:
            "Yes, the voting system is fully responsive and works on smartphones and tablets. You can access all features through your mobile browser, or download our dedicated mobile app for an optimized experience.",
        },
      ],
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#003B71] mb-4">Help Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about the University of Rwanda Voting System
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for help..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="faq" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            {filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try a different search term or browse the categories below
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((category) => (
                <div key={category.id} className="mb-6">
                  <h2 className="text-xl font-bold text-[#003B71] mb-4">{category.title}</h2>
                  <Accordion type="single" collapsible className="border rounded-lg">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="px-4 hover:no-underline">{faq.question}</AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="guides" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>Step-by-step instructions for using the voting system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Registration Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Learn how to register and set up your account with facial recognition
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/help/guides/registration">View Guide</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Voting Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Step-by-step instructions for casting your vote in an election
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/help/guides/voting">View Guide</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Facial Recognition Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Tips for successful facial recognition verification</p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/help/guides/facial-recognition">View Guide</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Mobile App Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        How to use the University of Rwanda Voting System mobile app
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/help/guides/mobile-app">View Guide</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Video Tutorials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Registration Tutorial</p>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Voting Tutorial</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-2">Send us an email and we'll respond within 24 hours</p>
                    <p className="font-medium">voting-support@ur.ac.rw</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-600 mb-2">Available Monday to Friday, 8:00 AM - 5:00 PM</p>
                    <p className="font-medium">+250 78 123 4567</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Submit a Support Ticket</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input id="subject" placeholder="What is your issue about?" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full min-h-[120px] p-3 border rounded-md"
                        placeholder="Describe your issue in detail"
                      ></textarea>
                    </div>

                    <Button className="bg-[#003B71] hover:bg-[#002a52]">Submit Ticket</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
