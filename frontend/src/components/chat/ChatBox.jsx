import React, { useMemo, useRef, useEffect, useState, useContext } from 'react'
import defaultImg from '../../assets/dafault.png'
import { Link, useNavigate } from 'react-router-dom'
import { emojiIcon, likeOutline } from '../../assets/svgIcons';
import { api } from '../../Interceptor/apiCall';
import { url } from '../../baseUrl';
import { AuthContext } from '../../context/Auth'
import OtherMessage from './OtherMessage';
import MyMessage from './MyMessage';
import Details from './Details';
import ReactTimeAgo from 'react-time-ago'
import Emoji from '../emoji/Emoji';
import { socket } from '../../App';
import Typing from './Typing';

export default function ChatBox({ roomId, deleteRoom }) {
    const typesocket = useMemo(() => socket, [])
    const [RoomName, setRoomName] = useState('')
    const [roomDetails, setRoomDetails] = useState('')
    const context = useContext(AuthContext)
    const [roomImage, setRoomImage] = useState()
    const [message, setMessage] = useState()
    const [snapShotMessages, setSnapShotMessages] = useState([])
    const [details, setDetails] = useState(false)
    const navigate = useNavigate()
    const [showEmojiPicker, setEmojiPicker] = useState(false)
    const [online, setOnline] = useState(false)
    const [typing, setTyping] = useState()
    const [lastSeen, SetLastSeen] = useState()


    const scrollRef = useRef()

    useEffect(() => {
        setDetails(false)
        api.get(`${url}/message/${roomId}`)
            .then(res => setSnapShotMessages(res.data))
            .catch(err => console.log(err))
        typesocket.emit('join-room', { roomId })
    }, [roomId, typesocket])

    useEffect(() => {
        typesocket.on('receive-message', (msg) => {
            if (msg.roomId === roomId) {
                setSnapShotMessages(prev => [...prev, msg])
            }
        })
        return () => {
            typesocket.off('receive-message')
        }
    }, [roomId, typesocket])

    useEffect(() => {
        updateScroll()
    }, [snapShotMessages])

    useEffect(() => {
        typesocket.on(`typinglistenon${roomId}`, (uid) => {
            setTyping(uid)
            updateScroll()
        })
        typesocket.on(`typinglistenoff${roomId}`, (uid) => {
            setTyping(undefined)
            updateScroll()
        })
    }, [roomId, typesocket])

    function handleDetailsToggle() {
        setDetails(prev => !prev)
    }

    function updateScroll() {
        var element = scrollRef.current;
        if (!element) return
        element.scrollTop = element.scrollHeight;
    }
    function handleKeyPress(e) {
        if (e.keyCode !== 13 || !message || message.trim().length === 0) return
        sendMessage(message)
    }

    async function handleLike() {
        sendMessage("like_true")
    }

    function sendMessage(m) {
        if (!m) return
        setMessage('')
        typesocket.emit('send-message', { roomId, message: m, uid: context.auth._id })
    }


    useEffect(() => {
        if (message === undefined) return
        const timer = setTimeout(() => {
            typesocket.emit("typingoff", { uid: context.auth._id, roomId })
        }, 1500)
        typesocket.emit("typingon", { uid: context.auth._id, roomId })
        return () => clearTimeout(timer)
    }, [context.auth._id, message, roomId, typesocket])

    function handleMessageInput(e) {
        setMessage(e.target.value)
    }

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
            SetLastSeen(resp.data.lastSeen)
            setRoomName(resp.data.name)
            setRoomImage(resp.data.avatar)
            setRoomDetails(resp.data.username)
        })).catch(err => console.log(err))

    }, [context.auth._id, roomId])

    function handleLeaveChat() {
        api.put(`${url}/chat/delete`, {
            roomId
        }).then((res) => {
            if (res.data) {
                console.log(res.data);
                deleteRoom(roomId)
                navigate('/chats/all')
            }
        }).catch(err => console.log(err))
    }
    function getEmoji(emoji) {
        setMessage(prev => prev + emoji)
    }
    return (
        <div style={{ width: '100%', position: 'relative', height: '100%' }}>
            <div style={{ width: '100%', position: 'relative', height: '100%' }} onClick={() => setEmojiPicker(false)}>
                {
                    details ? <Details handleLeaveChat={handleLeaveChat} handleDetailsToggle={handleDetailsToggle} roomId={roomId} /> :
                        <>
                            <div className="header_chat" style={{ width: '100%', borderBottom: '1px solid #dbdbdb', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {
                                    roomDetails ?
                                        <Link to={`/${roomDetails}`} >
                                            <div className="info_user_chat" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px' }}>
                                                <img src={roomImage || defaultImg} style={{ width: '40px', borderRadius: '50%', backgroundColor: '#eaeaea', position: 'relative' }} alt="" />
                                                {
                                                    online &&
                                                    <div style={{
                                                        backgroundColor: 'green', width: '15px', height: '15px', borderRadius: '50%', position: 'relative', top: '15px', left: '-9px', zIndex
                                                            : '99'
                                                    }}></div>
                                                }
                                                <div className="det_online" style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                                    <p style={{ fontSize: '14px' }}>{RoomName}</p>
                                                    {
                                                        online ?
                                                            <p style={{ fontSize: '13px', color: 'gray' }}>Active Now</p>
                                                            :
                                                            <p style={{ fontSize: '13px', color: 'gray', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>{lastSeen && <>
                                                                <p style={{ marginRight: '5px' }}> Active </p>
                                                                <ReactTimeAgo date={Date.parse(lastSeen)} locale="en-US" timeStyle="twitter" />
                                                                <p style={{ marginLeft: '5px' }}>ago</p>
                                                            </>}</p>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                        :
                                        <div >
                                            <div className="info_user_chat" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px' }}>
                                                <img src={roomImage || defaultImg} style={{ width: '40px', borderRadius: '50%', backgroundColor: '#eaeaea' }} alt="" />
                                                <p style={{ marginLeft: '10px', fontSize: '14px' }}>{RoomName}</p>
                                            </div>
                                        </div>
                                }

                                <div onClick={() => handleDetailsToggle()} className="svg_info" style={{ marginRight: '18px', marginTop: '5.5px', cursor: 'pointer' }}>
                                    <svg aria-label="View thread details" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>

                                </div>
                            </div>
                            <div className="chat_content" style={{ width: '100%' }}>
                                <div className="converstaions" ref={scrollRef} style={{ height: '72vh', overflowY: 'scroll', padding: '20px 0px', width: '100%', fontSize: '14px' }}>

                                    {
                                        snapShotMessages.map((msg, index) => {
                                            return <div key={index}>{context.auth._id === msg.uid ?
                                                <MyMessage msg={msg} />
                                                :
                                                <OtherMessage msg={msg} />
                                            }
                                            </div>
                                        })
                                    }
                                    {typing && <Typing user={typing} />}

                                </div>


                                <div className="input_container" style={{ width: '100%', position: 'absolute', bottom: '8px', zIndex: '22' }}>
                                    <div className="input_box" style={{ width: '95%', display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1px solid #dbdbdb', margin: 'auto', height: '48px', borderRadius: '19px', justifyContent: 'space-evenly' }}>
                                        <button onClick={(e) => { e.stopPropagation(); setEmojiPicker(prev => !prev) }} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {emojiIcon}
                                        </button>
                                        <input onKeyDown={e => handleKeyPress(e)} onChange={handleMessageInput} value={message} style={{ width: '80%', height: '100%', border: 'none', marginLeft: '5px', outline: 'none' }} type="text" placeholder='Message...' />
                                        <button onClick={() => handleLike()} className='no_style' style={{ background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {likeOutline}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>
            {
                showEmojiPicker && <div className="emoji-picker" style={{ position: 'absolute', bottom: '70px', left: '20px' }}>
                    <Emoji getEmoji={getEmoji} />
                </div>
            }
        </div>
    )
}
