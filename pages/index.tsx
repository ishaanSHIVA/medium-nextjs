import { url } from 'inspector'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import Header from '../components/Header'

import {sanityClient,urlFor} from "../sanity"

import { Post } from '../typings'


interface Props {
  posts: [Post];
}


const Home: NextPage<Props> = ({ posts}:Props) => {
  useEffect(() => {
    console.log(posts)
  }, [posts])
  
  return (
    <div className="mx-auto max-w-7xl ">
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

        <div className="grid grid-cols-1 gap-3 p-2 md:gap-6 md:p-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(
          post => {
            return (
                <Link key={post._id} href={`post/${post.slug.current}`}>
                <div className="overflow-hidden border rounded-lg cursor-pointer group">
                  <img className="object-cover w-full transition-transform ease-in-out h-60 duration-60 group-hover:scale-105" src={urlFor(post.mainImage).url()!} alt="" />
                  <div  className="flex justify-between p-5 bg-white">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p className="text-xs">{post.description} by {post.author.name}</p>
                    </div>
                    <img className="w-12 h-12 rounded-full" src={urlFor(post.author.image).url()} alt="" />
                  </div>
                </div>
                
            </Link>
            )
            
          }
        )}
        </div>

    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
  title,
  slug,
  description,
  mainImage,
  author -> {
  name,
  image
}
}`
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts
  }
}
}