'use client'
import React, { useState } from 'react'
import PostUserGroup from '../post-user-group/PostUserGroup'
import { Heart, MessageCircleMore } from 'lucide-react'
import { Button } from '../ui/button'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import PostDetail from './PostDetail'

interface Props {
    post: any,
    queryKey: string | any,
}

const PostItem = ({ post, queryKey }: Props) => {
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false)

    const { mutate: reaction, isPending } = useMutation({
        mutationFn: (id: string) => postService.reactionPost(id),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey })

            const previousData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old) return old;

                const newPages = old.pages.map((page: any) => {
                    const hasPost = page.data.metadata.posts.some((p: any) => p._id.toString() === postId.toString());

                    if (!hasPost) return page;

                    return {
                        ...page,
                        data: {
                            ...page.data,
                            metadata: {
                                ...page.data.metadata,
                                posts: page.data.metadata.posts.map((p: any) => {
                                    if (p._id.toString() === postId.toString()) {
                                        return {
                                            ...p,
                                            isReact: !p.isReact,
                                            reactionCount: p.isReact ? p.reactionCount - 1 : p.reactionCount + 1
                                        };
                                    }
                                    return p;
                                })
                            }
                        }
                    };
                });

                return { ...old, pages: newPages };
            });

            return { previousData };
        },
        onError: (err, postId, context) => {
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
        }
    })

    const handleReaction = () => {
        if (post?._id) {
            reaction(post?._id)
        }
    }

    const handleOpenViewDetail = () => {
        setIsOpen(true)
    }

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

            <div className='flex items-center justify-between p-2 px-4'>
                <div className='flex items-center gap-2'>
                    <Heart className='w-4' />
                    <span className=''>{post?.reactionCount} likes</span>
                </div>

                <div className='flex items-center gap-1 group cursor-pointer' onClick={handleOpenViewDetail}>
                    <span className='group-hover:underline'>{post?.commentCount}</span>
                    <span className='group-hover:underline'>comments</span>
                </div>
            </div>

            <div className='w-full flex items-center justify-between'>
                <Button
                    variant={'ghost'}
                    className='w-1/2 flex items-center justify-center cursor-pointer p-4'
                    onClick={handleReaction}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${post?.isReact
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-500'
                            }`}
                    />
                </Button>

                <Button
                    variant={'ghost'}
                    className='w-1/2 flex items-center justify-center cursor-pointer p-4'
                >
                    <MessageCircleMore className='w-4' />
                </Button>
            </div>

            <PostDetail postId={post?._id} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default PostItem