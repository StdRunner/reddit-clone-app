import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Post } from '../types'
import dayjs from 'dayjs'

interface PostCardProps {
    post: Post
}

const PostCard = ({ post: {
    identifier, slug, title, body, subName, createdAt, voteScore, userVote, commentCount, url, username, sub
} }: PostCardProps) => {

    return (
        <div
            className='flex mb-4 bg-white rounded'
            id={identifier}
        >
            {/* 투표 기능 부분 */}
            <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                {/* 좋아요 부분 */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    // onClick={() => vote(1)}
                >
                    <i
                        className={classNames("fas fa-arrow-up", {
                            "text-red-500": userVote === 1
                        })}
                    >
                    </i>
                </div>
                <p className="text-xs font-bold">{voteScore}</p>
                {/* 싫어요 부분 */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    // onClick={() => vote(-1)}
                >
                    <i
                        className={classNames("fas fa-arrow-down", {
                            "text-blue-500": userVote === -1
                        })}
                    >
                    </i>
                </div>
            </div>
            
            {/* 포스트 데이터 부분 */}
            <div className='w-full p-2'>
                {/* <div className='flex items-center'>
                    <Link href={`/r/${subName}`}>
                        <a>
                            <Image
                                src={sub!.imageUrl}
                                alt="sub"
                                className='rounded-full cursor-pointer'
                                width={12}
                                height={12}
                            />
                        </a>
                    </Link>
                    <Link href={`/r/${subName}`}>
                        <a className='ml-2 text-xs font-bold cursor-pointer hover:underline'>
                            /r/{subName}
                        </a>
                    </Link>
                    <span className='mx-1 text-xs text-gray-400'>ㆍ</span>
                </div> */}
                
                <p className='text-xs test-gray-400'>
                    Posted by
                    <Link href={`/r/${username}`}>
                        <a className='mx-1 hover:underline'>/r/{username}</a>
                    </Link>
                    <Link href={url}>
                        <a className='mx-1 hover:underline'>
                            {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                        </a>
                    </Link>
                </p>
            
                <Link href={url}>
                    <a className='abc my-1 text-lg font-medium'>{title}</a>
                </Link>
                {body && <p className='my-1 text-sm'>{body}</p>}
                <div className='flex'>
                    <Link href={url}>
                        <a>
                            <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                            <span>{commentCount}</span>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PostCard
