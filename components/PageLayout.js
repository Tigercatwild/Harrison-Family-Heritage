import ScriptureBar from './ScriptureBar'
import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScriptureBar />
      <Navigation />
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                Harrison Family Heritage
              </h3>
              <p className="text-gray-300">
                Preserving our legacy, connecting our generations, honoring our roots.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#family-tree" className="hover:text-white">Family Tree</a></li>
                <li><a href="#history" className="hover:text-white">Our History</a></li>
                <li><a href="#gallery" className="hover:text-white">Photo Gallery</a></li>
                <li><a href="#directory" className="hover:text-white">Directory</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">
                For questions about the family website or to report issues, 
                please contact the family administrators.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Harrison Family Heritage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
