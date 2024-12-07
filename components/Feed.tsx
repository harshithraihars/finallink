import React from 'react'
import PostInput from './PostInput'
import Posts from './Posts'
import { getAllPosts } from '@/lib/serveractions';
import PostHandler from './PostHandler';

const Feed = async ({user,userInfo}:{user:any,userInfo:any}) => {
    const userData = JSON.parse(JSON.stringify(user));
    const posts = await getAllPosts();
    let userInfoClient;
    if(userInfo){
      userInfoClient=JSON.parse(JSON.stringify(userInfo))
    }
    const parsedPosts=JSON.parse(JSON.stringify(posts))
  return (
    <div className='flex-1'>
        <PostInput user={userData}/>
        <PostHandler posts = {parsedPosts!} userInfo={userInfoClient}/>
        
    </div>
  )
}

export default Feed