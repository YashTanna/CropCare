import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Camera, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-200">
              Plant Disease Detection
            </h1>
          </div>
          <p className="text-lg md:text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto leading-relaxed">
            Upload a plant leaf image to detect diseases instantly and get solutions.
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border-green-200 dark:border-green-800">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
                  <p className="text-muted-foreground">Take or upload a photo of the affected plant leaf</p>
                </div>
                <div className="text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">Our AI instantly identifies the disease</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Get Solutions</h3>
                  <p className="text-muted-foreground">Receive treatment recommendations and care tips</p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/predict">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">Instant Detection</h3>
                <p className="text-muted-foreground">
                  Get immediate results with our advanced AI model trained on thousands of plant disease images.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">Expert Solutions</h3>
                <p className="text-muted-foreground">
                  Receive detailed treatment recommendations and prevention tips from agricultural experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
