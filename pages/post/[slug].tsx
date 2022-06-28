import React from 'react'
import { sanityClient,urlFor } from "../../sanity"

import Header from '../../components/Header'
import { Post } from "../../typings"
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Head from 'next/head'

interface Props {
    post: Post;
}

const Post = (props:Props) => {
    const {post} = props;
    console.log(post)
    console.log(process.env.NEXT_PUBLIC_SANITY_DATASET!)
  return (
      <>
      
      <Head>
     <title>{post.title}</title>
     <link rel="icon" href="/favicon.ico" />
       </Head>
        <main>
            <Header />
        <img className="object-cover w-full h-40" src={urlFor(post.mainImage).url()!} alt="" />

        <article className="max-w-3xl mx-auto">
            <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
            <h2 className="mb-2 text-xl font-light text-gray-500">{post.description}</h2>

            <div className="flex items-center space-x-2">
                <img className="w-10 h-10 rounded-full" src={urlFor(post.author.image).url()} alt="" />
                <p className="text-sm font-extralight">Blog post by <span className="text-green-600"> {post.author.name}</span> - Published by {new Date(post._createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-10 ">
                <PortableText 
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                    content={post.body}
                    serializers={
                        {
                            h1: (props:any) => {
                                <h2 className="my-5 text-2xl font-bold" {...props} />
                                
                            
                            },
                            h2:  (props:any) => {
                                return <h2 className="my-5 text-2xl font-bold" {...props} />
                            
                            },
                            li: ({children}:any) => (
                                <li className="ml-4 list-disc">{children}</li>
                            ),
                            link: ({href,children}:any) => (
                                <a href={href} className="text-blue-500 hover:underline">
                                    {children}
                                </a>
                            )
                            
                        }
                    }
                />
            </div>
        </article>
        <hr className="max-w-lg mx-auto my-5 border border-yellow-500" />

        {/* <form className="flex flex-col max-w-2xl p-5 mx-auto my-10 mb-10" action="">
            <label htmlFor="">
                <span>
                    Name
                </span>
                <input placeholder="John Appleseed" type="text" />

            </label>
            <label htmlFor="">
                <span>
                    Email
                </span>
                <input placeholder="John Appleseed" type="email" />

            </label>
            <label htmlFor="">
                <span>
                    Comment
                </span>
                <textarea rows={8} placeholder="John Appleseed" type="text-area" />

            </label>

        </form> */}
    </main>
    </>
    
  )
}

export default Post

export const getStaticPaths = async () => {
    const query =  `
        *[_type == "post"] {
            _id,
            slug {
                current
            }
        }
    `
    const posts = await sanityClient.fetch(query)
    
    const paths = posts.map((post:Post) => ({
        params: {
            slug: post.slug.current
        }
    }))
    return {
        paths,
        fallback:'blocking'
    }
}

export const getStaticProps:GetStaticProps = async ({ params }) => {
      const   query = `
      *[_type == "post"&& slug.current == $slug][0] {
            title,
            _id,
            _createdAt,
            description,
            mainImage,
            slug,
            body,
            author -> {
               name,
               image
          }
        }`

        console.log("Slug ",params)

        const post = await sanityClient.fetch(query,{
            slug:params?.slug
        })
        console.log("Server Side render :- ",post)
        if(!post) {
            return {
                notFound:true
            }
        }
        return {
            props: {
                post
            },
            revalidate: 60, // after 60 seconds update cache 
        }
}
/*
*[_type == "post"&& slug.current == $slug][0] {
            _id,
            _createdAt,
            title,
            author -> {
            name,
            image
            },
            'comments': *[
                _type == "comment" && 
                post._ref == ^._id &&
                approved == true 
            ],
            slug,
            body,
            description,
            mainImage,

      }  
*/