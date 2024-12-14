import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - FlixHQ",
  description: "Contact information for FlixHQ support",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-20 h-screen text-center max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-xl font-bold">
        Mail us to: <b>admin@flixhq.lol</b>
      </p>
    </div>
  )
}