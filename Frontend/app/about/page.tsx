import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Target, Users, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-10 w-10 text-green-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200">
              About Plant Disease Detection
            </h1>
          </div>
          <p className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
            Empowering farmers and gardeners with AI-powered plant health diagnostics
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Project Purpose */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <Target className="h-6 w-6 mr-2" />
                Project Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Our Plant Disease Detection system leverages advanced artificial intelligence to help farmers,
                gardeners, and agricultural professionals quickly identify plant diseases from leaf images. Early
                detection is crucial for effective treatment and preventing crop losses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By combining computer vision technology with expert agricultural knowledge, we provide instant diagnosis
                and treatment recommendations, making plant health management accessible to everyone.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <Shield className="h-6 w-6 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Upload Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a clear photo of the affected plant leaf and upload it to our system
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our trained AI model analyzes the image and identifies potential diseases
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Get Solutions</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed treatment recommendations and prevention strategies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <Users className="h-6 w-6 mr-2" />
                Usage Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Prepare Your Image</h4>
                    <p className="text-sm text-muted-foreground">
                      Take a clear, well-lit photo of the affected leaf. Ensure the disease symptoms are visible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload and Analyze</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to the Prediction page, upload your image, and click "Predict Disease" to get results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      Read the AI-generated treatment advice and ask follow-up questions in the chat interface.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Take Action</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement the suggested treatments and monitor your plants for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Best Results */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Use natural lighting when taking photos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Focus on leaves showing clear disease symptoms</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Avoid blurry or low-resolution images</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Include the entire leaf in the frame when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Consult local agricultural experts for severe cases</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
