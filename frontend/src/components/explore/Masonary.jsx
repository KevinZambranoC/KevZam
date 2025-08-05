import React, { useEffect, useState } from 'react'
import { Image } from '../post/Image'

export const Masonary = ({ posts }) => {
    const [images, setImages] = useState([])
    useEffect(() => {
        setImages(posts)
    }, [posts])
    const filterPosts = (id) => {
        setImages(prev => prev.filter(item => item._id !== id))
    }
    return (
        <div className='grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', rowGap: '17px', columnGap: '23px' }}>
            {
                images?.map(item =>
                    <Image filterPosts={filterPosts} userId={item.owner} postId={item._id} likes={item.likes.length} comments={item.comments.length} key={item._id} src={item.files[0].link}></Image>
                )
            }
        </div>
    )
}
