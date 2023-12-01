import React from 'react'
import FirebaseAPI from '@/app/firebase/firebaseAPI'



export default function SendMessage(props: any) {
    const { showModal, setShowModal, data } = props
    const { sendMessage } = FirebaseAPI()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const result = sendMessage(data.email, e.target.message.value, data.username)
    }

    return (
        <div >

            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor='message' className="label">Message</label>
                    <div className="control">
                        <textarea id='message' name='message' className="textarea" placeholder="Textarea"></textarea>
                    </div>
                </div>
                <button className="button is-success">Save changes</button>
                <button className="button">Cancel</button>
            </form>



        </div>
    )
}
