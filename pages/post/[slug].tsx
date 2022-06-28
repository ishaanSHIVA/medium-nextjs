import React, { useState } from 'react'
import { sanityClient,urlFor } from "../../sanity"
import {useForm,SubmitHandler} from 'react-hook-form'

import Header from '../../components/Header'
import { Post } from "../../typings"
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Head from 'next/head'

interface IFormInput { 
    _id: string;
    name: string;
    email: string;
    comment: string;
}


interface Props {
    post: Post;
}

const Post = (props:Props) => {
    
    const [submitted, setSubmitted] = useState(false)
    const {post} = props;
    console.log(post)
    const { register,handleSubmit,formState:{errors} } = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSubmitted(true)
           await fetch("/api/createComment", {
               method: "POST",
               body: JSON.stringify(data)
           }).then(() => {
               console.log(data)
           }).catch((err) => {
               console.log(err)
           })
    }
    
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

        {submitted && (
            <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 text-white bg-yellow-500">
                <h3 className='text-3xl font-bold'>Thank you for submitting!</h3>
                <p>It will show after the form has been approvd by the content creater.</p>
            </div>
        )}

        {!submitted && (
            
        

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-2xl p-5 mx-auto my-10 mb-10" action="">
            <h3 className="text-sm text-yellow-500 ">Enjoyed the article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2"/>

            <input  type="hidden" value={post._id} name="_id" {...register("_id")} />

            <label className='block mb-5 ' htmlFor="">
                <span className="text-gray-700 ">
                    Name
                </span>
                <input {...register("name",{required:true})}   className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500" placeholder="John Appleseed" type="text" />

            </label>
            <label className='block mb-5 ' htmlFor="">
                <span className="text-gray-700 ">
                    Email
                </span>
                <input {...register("email",{required:true})}  w-full ring-yellow-500 className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500" placeholder="John Appleseed" type="email" />

            </label>
            <label className='block mb-5 ' htmlFor="">
                <span className="text-gray-700 ">
                    Comment
                </span>
                <textarea {...register("comment",{required:true})} className="block w-full px-3 mt-1 border rounded shadow outline-none focus:ring pt-1y-2 m form-textarea form-input ring-yellow-500" rows={8} placeholder="John Appleseed" type="text-area" />

            </label>

            {/* Error */}
            <div className="flex flex-col p-5 ">
            {errors.name && <span className="text-red-500">- The Name Field is required</span>}
            {errors.comment &&<span className="text-red-500">- The Comment Field is required</span>}
            {errors.email &&<span className="text-red-500">Email Field is required</span>}
            </div>

            <input className="px-4 font-bold text-white bg-yellow-500 rounded cursor-pointer hover:bg-yellow-400 focus:outline-none focus:shadow-outline" type="submit" />

        </form>
        )}

        {/* Comments */}
        <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 space-y-2 shadow shadow-yellow-500">
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2" />
            {post.comments.map(comment => (
                <div key={comment._id} className="">
                    <p><span className="text-yellow-500">{comment.name}</span>:{comment.comment}</p>
                </div>
            ))}
        </div>
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
            'comments': *[
                _type == "comment" && 
                post._ref == ^._id &&
                approved == true 
            ],
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