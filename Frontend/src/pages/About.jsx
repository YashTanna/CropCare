const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8">
        <h1 className="text-4xl font-bold text-green-800 mb-6">About Plant Disease Prediction</h1>

        <div className="space-y-6 text-green-700">
          <p className="text-lg leading-relaxed">
            Our Plant Disease Prediction system is an AI-powered tool designed to help farmers, gardeners, and plant
            enthusiasts identify diseases in their plants quickly and accurately.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-3">How It Works</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Upload a clear image of the affected plant or leaf</li>
              <li>Our machine learning model analyzes the image for disease symptoms</li>
              <li>Get instant results with the predicted disease name</li>
              <li>Receive treatment recommendations through our AI chatbot</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Real-time disease detection using advanced AI</li>
              <li>Support for multiple plant species and diseases</li>
              <li>Integrated chatbot for treatment recommendations</li>
              <li>Mobile-friendly responsive design</li>
              <li>Easy-to-use drag-and-drop interface</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-3">Technology Stack</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>React.js for the frontend interface</li>
              <li>Machine Learning model for disease classification</li>
              <li>Wikipedia API integration for disease information</li>
              <li>Tailwind CSS for responsive styling</li>
              <li>React Router for navigation</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Disclaimer</h3>
            <p className="text-green-600">
              This tool is designed to assist in plant disease identification but should not replace professional
              agricultural advice. For serious plant health issues, please consult with local agricultural experts or
              extension services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
