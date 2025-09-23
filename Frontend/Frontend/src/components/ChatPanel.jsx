// import React, { useEffect, useRef, useState } from "react";

// export default function ChatPanel({ messages = [], onSend = () => { }, autoFocusTrigger = 0 }) {
//     const scrollRef = useRef();
//     const inputRef = useRef();
//     const [text, setText] = useState("");

//     // scroll to bottom when messages change
//     useEffect(() => {
//         if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }, [messages]);

//     // focus input whenever autoFocusTrigger changes (PredictPage increments it)
//     useEffect(() => {
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [autoFocusTrigger]);

//     function handleSubmit(e) {
//         e?.preventDefault();
//         const val = text.trim();
//         if (!val) return;
//         onSend(val);
//         setText("");
//         // focus again
//         if (inputRef.current) inputRef.current.focus();
//     }

//     return (
//         <div className="h-full flex flex-col">
//             <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center">🤖</div>
//                 <h3 className="text-emerald-700 font-semibold">Plant Care Assistant</h3>
//             </div>

//             <div ref={scrollRef} className="flex-1 overflow-auto pr-3 space-y-4 max-h-[420px]">
//                 {messages.length === 0 && (
//                     <div className="text-sm text-gray-500">No response yet — upload image and press Predict.</div>
//                 )}

//                 {messages.map((m, i) => (
//                     <div key={i} className={m.role === "bot" ? "bg-gray-100 p-4 rounded-lg" : "bg-emerald-500 text-white p-3 rounded-lg self-end max-w-[85%]"}>
//                         <div className="text-sm whitespace-pre-wrap">{m.text}</div>
//                     </div>
//                 ))}
//             </div>

//             <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
//                 <input
//                     ref={inputRef}
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     className="flex-1 border rounded-md px-3 py-2"
//                     placeholder="Ask something about the result..."
//                 />
//                 <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Send</button>
//             </form>
//         </div>
//     );
// }
import React, { useEffect, useRef } from "react";

export default function ChatPanel({ messages = [], autoFocusTrigger = 0 }) {
    const scrollRef = useRef();
    const containerRef = useRef(); // NEW ref for the whole panel

    // scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // scroll the entire ChatPanel into view when autoFocusTrigger changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [autoFocusTrigger]);

    return (
        <div ref={containerRef} className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center">🤖</div>
                <h3 className="text-emerald-700 font-semibold">Plant Care Assistant</h3>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-auto pr-3 space-y-4 max-h-[420px]"
            >
                {messages.length === 0 && (
                    <div className="text-sm text-gray-500">
                        No response yet — upload image and press Predict.
                    </div>
                )}

                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={
                            m.role === "bot"
                                ? "bg-gray-100 p-4 rounded-lg"
                                : "bg-emerald-500 text-white p-3 rounded-lg self-end max-w-[85%]"
                        }
                    >
                        <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
