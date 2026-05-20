import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import PostUserGroup from '../post-user-group/PostUserGroup'
import { Heart, Loader2, MessageCircleMore } from 'lucide-react'
import { Button } from '../ui/button'
import AddComment from './AddComment'
import CommentList from './CommentList'

interface Props {
    postId: string,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

const PostDetail = ({ postId, isOpen, setIsOpen }: Props) => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => postService.getPostDetail(postId),
        enabled: isOpen && !!postId,
        staleTime: 0,
        refetchOnMount: true,
    }) as any

    const post = data?.data?.metadata

    const { mutate: reaction, isPending } = useMutation({
        mutationFn: (id: string) => postService.reactionPost(id),
        onMutate: async (postId) => {
            queryClient.cancelQueries({
                queryKey: ['post', postId]
            })

            const previousData = queryClient.getQueryData(['post', postId])

            queryClient.setQueryData(['post', postId], (old: any) => {

                if (!old) return

                console.log('old: ', old)

                const isCurrentReacted = old.data.metadata.isReact

                return {
                    ...old,
                    data: {
                        ...old.data,
                        metadata: {
                            ...old.data.metadata,
                            isReact: !isCurrentReacted,
                            reactionCount: isCurrentReacted ?
                                Math.max(0, old.data.metadata.reactionCount - 1) :
                                old.data.metadata.reactionCount + 1
                        }
                    }
                }
            })

            return { previousData }
        },
        onError: (err, postId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['post', postId], context.previousData)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
    })

    const handleReaction = () => {
        if (post?._id) {
            reaction(post?._id)
        }
    }

    if (isLoading && isOpen) {
        return (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
        )
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogContent className="sm:max-w-sm md:min-w-2xl">
                <DialogHeader>
                    <DialogTitle className='text-center font-bold'>Post Detail</DialogTitle>
                </DialogHeader>

                <div>
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

                        <div className='flex items-center gap-1 cursor-pointer'>
                            <span className=''>{post?.commentCount ?? 0}</span>
                            <span className=''>comments</span>
                        </div>
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

                <div>
                    <AddComment postId={post?._id} parentId={null} />

                    <CommentList postId={post?._id} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostDetail