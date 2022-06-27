import { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'


const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      
        <div className="flex items-center bg-yellow-400 border-black border-y justify-space-between">
          <div className="items-center px-10 space-y-5">
            <h1 className="max-w-xl font-serif text-6xl"><span className="underline decoration-4 decoration-black">Medium</span> is a place to write,read and connect!</h1>
            <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
          </div>
          <img className="hidden h-32 py-10 md:inline-flex lg:h-full lg:py-0" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="" />
        </div> 

        {/* Posts */}

    </div>
  )
}

export default Home
