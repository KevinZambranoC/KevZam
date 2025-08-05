import React, { useEffect, useState, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom';
import defaultImg from '../../assets/dafault.png'
import { url } from '../../baseUrl';
import { AuthContext } from '../../context/Auth';
import { api } from '../../Interceptor/apiCall';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { socket } from '../../App';

export default function RoomName({ roomId }) {
    // console.log("roomcompoent  " + roomId);
    const typesocket = useMemo(() => socket, [])

    const context = useContext(AuthContext)
    const [roomImage, setRoomImage] = useState()
    const [roomName, setRoomName] = useState('')
    const [lastmessage, setlastmessage] = useState('')
    const [online, setOnline] = useState(false)
    useEffect(() => {
        api.get(`${url}/chat/${roomId}`).then(res => {
            const nameArr = res.data.people.filter(id => id !== context.auth._id)
            if (nameArr.length > 1) {
                return api.get(`${url}/user/get/${nameArr[0]}`).then(resp => {
                    return { data: { name: `${resp.data.name} and ${nameArr.length - 1} others`, avatar: "https://images.squarespace-cdn.com/content/v1/53eba949e4b0c2eda84a38cc/1592250464335-933Q01Q1A0JOXSIRDVSR/social.png?format=500w", username: '', online: false } }
                })
            }
            return api.get(`${url}/user/get/${nameArr[0]}`)
        }).then((resp => {
            setOnline(resp.data.online)
            setRoomName(resp.data.name)
            setRoomImage(resp.data.avatar)
        })).catch(err => console.log(err))
    }, [context.auth._id, roomId])

    useEffect(() => {
        api.get(`${url}/message/${roomId}?limit=1&sort=desc`).then(res => {
            if (res.data[0]) setlastmessage(res.data[0].message)
        }).catch(err => console.log(err))
    }, [roomId])

    useEffect(() => {
        const handler = (msg) => {
            if (msg.roomId === roomId) setlastmessage(msg.message)
        }
        typesocket.on('receive-message', handler)
        return () => typesocket.off('receive-message', handler)
    }, [roomId, typesocket])

    return (
        <Link to={`/chats/${roomId}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: "18px 0", paddingLeft: '22px', cursor: 'pointer' }} >
            <img style={{ borderRadius: '50%', width: '52px', height: '52px', backgroundColor: '#eaeaea', position: 'relative', objectFit: 'cover' }} src={roomImage || defaultImg} alt="" />
            {
                online &&
                <div style={{
                    backgroundColor: 'green', width: '15px', height: '15px', borderRadius: '50%', position: 'relative', top: '15px', left: '-9px', zIndex
                        : '99'
                }}></div>
            }
            <div className="nameandmsg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '12px', }}>
                <p style={{ fontSize: '13.75px' }}>{roomName ? roomName : "...."}</p>
                <p style={{ fontSize: '12px', color: 'gray' }}>{lastmessage === "like_true" ? <FavoriteIcon sx={{ fontSize: '18px', marginTop: '4px', color: '#e33636' }} /> : lastmessage.includes("http") ? "image" : lastmessage.length > 27 ? lastmessage.slice(0, 27) + "  ..." : lastmessage}</p>
            </div>
        </Link>
    )
}
