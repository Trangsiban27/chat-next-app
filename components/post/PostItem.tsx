import React from 'react'
import PostUserGroup from '../post-user-group/PostUserGroup'

interface Props {
    post: any
}

const PostItem = ({ post }: Props) => {

    console.log('post: ', post)

    return (
        <div className='flex flex-col w-full bg-white shadow rounded-lg overflow-hidden'>
            <PostUserGroup data={post?.author} postCreatedAt={post?.createdAt} />

            {(post?.content && post?.media?.[0]) && <div className='mt-2'>
                <span className='px-3'>{post?.content}</span>

                <div className='w-full mt-3'>
                    <img className={'w-full'} src={post?.media?.[0]?.url} alt={'Post image'} />
                </div>
            </div>}

            {(post?.content && post?.media?.length === 0) && (
                <div className='p-3'>
                    {post?.content}
                </div>
            )}
        </div>
    )
}

export default PostItem