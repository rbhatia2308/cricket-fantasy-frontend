import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase"; // ✅ Adjust import based on your project

const ChatBox = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "groups", groupId, "chat"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !newMsg.trim()) return;

    await addDoc(collection(db, "groups", groupId, "chat"), {
      text: newMsg,
      sender: user.displayName || user.email,
      uid: user.uid,
      createdAt: Timestamp.now(),
      type: "user",
    });

    setNewMsg("");
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow mt-4 max-h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p className="text-center text-gray-500">Loading chat...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded ${
                msg.type === "system"
                  ? "bg-yellow-100 text-center text-sm text-yellow-800"
                  : msg.uid === auth.currentUser?.uid
                  ? "bg-blue-100 text-blue-900 self-end max-w-[70%]"
                  : "bg-gray-100 text-gray-900 self-start max-w-[70%]"
              }`}
            >
              {msg.type !== "system" && (
                <div className="text-xs text-gray-600 font-medium">{msg.sender}</div>
              )}
              <div className="text-sm">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-2 flex gap-2">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
