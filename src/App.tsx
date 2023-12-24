
import { Link } from 'react-router-dom'
import './App.css'
import { Button } from "@/components/ui/button"



function App() {

  return (
    <>

<section className='h-screen flex items-center justify-center'>

      <Button> <Link to="/protect-route">Get start</Link></Button>
    </section>


    </>
  )
}

export default App
