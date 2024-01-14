

import { History } from 'lucide-react';

function App() {
  return (
    <>
      <section className='flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12 page-header pb-8'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
         Ememo Home
        </h1>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
        <History className='inline ' /> Version history
        </p>
      </section>
    </>
  );
}

export default App;
