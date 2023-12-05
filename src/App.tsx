
import './App.css'
import { Button } from "@/components/ui/button"



function App() {

  return (
    <>

<section className='flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12 page-header pb-8'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        The Joke Tax Chronicles
      </h1>
      <img src='http://127.0.0.1:8000/media/images/post.png'/>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
       Intregate with dark mode. Thanks for shadCn
      </p>
      <Button>Get start</Button>
    </section>


    </>
  )
}

export default App
