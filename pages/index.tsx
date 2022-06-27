import { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'


const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      
        {/* <div className="">
          <div className="">
            <h1>Medium is a place to write,read and connect!</h1>
            <h4>It's easy and free to post your thinking on any topic and connect with millions of readers.</h4>
          </div>
          <div className=""></div>
        </div> */}

    </div>
  )
}

export default Home
