'use client'

import MessageCard from "@/components/MessageCard"
import { Message } from "@/types"
import { useChat } from "@/hooks/useChat"

const App = () => {
    const{ messages, input, handleSubmit, handleInputChange } = useChat()
    
    return (
        <div className="flex h-full flex-col w-full max-w-xl pb-36 pt-9 mx-auto stretch">
            <ul className="space-y-4">
                {messages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="max-w-xl w-full mx-auto relative">
                <input
                    className="w-full p-3 focus-visible:outline-gray-300 border border-gray-300 rounded-md shadow-xl focus:shadow-2xl transition-all"
                    type="text"
                    value={input}
                    placeholder="Type a message..."
                    onChange={handleInputChange}
                />
                <button className="absolute right-3 bg-gray-200 hover:text-white p-1 top-1/2 -translate-y-1/2 rounded max-w-xs hover:bg-green-400 transition-all">
                    Send
                </button>
            </form>
        </div>
    )
}

export default App
