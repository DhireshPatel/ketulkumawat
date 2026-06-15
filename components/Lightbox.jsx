// 'use client'
// import { useEffect } from 'react'

// export default function Lightbox({ src, onClose }) {
//     useEffect(() => {
//         const handleKey = (e) => {
//             if (e.key === 'Escape') onClose()
//         }
//         document.addEventListener('keydown', handleKey)
//         if (src) {
//             document.body.style.overflow = 'hidden'
//         }
//         return () => {
//             document.removeEventListener('keydown', handleKey)
//             document.body.style.overflow = ''
//         }
//     }, [src, onClose])

//     if (!src) return null

//     return (
//         <div className={`lightbox${src ? ' active' : ''}`} onClick={onClose}>
//             <button className="lightbox-close" onClick={onClose}>✕</button>
//             <img
//                 id="lightboxImg"
//                 src={src}
//                 alt="Expanded view"
//                 onClick={(e) => e.stopPropagation()}
//             />
//             <p className="lightbox-caption"></p>
//         </div>
//     )
// }


'use client'
import { useEffect, useState } from 'react'

export default function Lightbox({ src, onClose }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (src) {
            setTimeout(() => setVisible(true), 10)
        } else {
            setVisible(false)
        }
    }, [src])

    if (!src) return null

    return (
        <div
            className={`lightbox ${visible ? 'active' : ''}`}
            onClick={onClose}
        >
            <button
                className="lightbox-close"
                onClick={onClose}
            >
                ✕
            </button>

            <img
                id="lightboxImg"
                src={src}
                alt="Expanded view"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}