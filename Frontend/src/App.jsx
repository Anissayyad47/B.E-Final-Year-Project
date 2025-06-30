import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextToImageGenerator from './Components/TextToImageGenerator'
import VirtualTryOn from './Components/VirtualTryOn'
import Home from './Components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Home></Home>
    </div>
    </>
  )
}

export default App
