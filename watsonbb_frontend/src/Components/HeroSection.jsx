import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const HeroSection = () => {
  const fullText = 'Find your next favorite book with Watson Book Buddy!';
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [latestBotReply, setLatestBotReply] = useState('');

  useEffect(() => {
    const shownBefore = localStorage.getItem("intro_shown");
    if (shownBefore) {
      setShowIntro(false);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    let timeout;

    if (index < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 50);
    } else {
      localStorage.setItem("intro_shown", "true");

      timeout = setTimeout(() => {
        setShowIntro(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [index, showIntro]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setShowIntro(false);

    const user_message = input;

    setChatHistory((prev) => [...prev, { user: user_message, bot: "Thinking..." }]);
    setInput('');

    try {
      const res = await fetch('https://watson-book-buddy-chatbot.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: user_message }),
      });

      if (!res.ok) {
        console.error('API response not ok', res.status);
        return;
      }

      const data = await res.json();
      const botReply = data.reply;
      setLatestBotReply(botReply);

      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botReply;
        return updated;
      });
    } catch (error) {
      console.error('Error fetching chatbot reply:', error);
    }
  };

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative text-center py-24 px-6 bg-gray-700 dark:from-gray-900 dark:to-black transition-all duration-300"
    >
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">

        {showIntro ? (
          <>
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white min-h-[100px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <span className="text-rose-500 dark:text-rose-500">
                {displayedText}
              </span>
              <span className="animate-pulse text-blue-600 dark:text-blue-400">|</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-bold text-gray-300 dark:text-gray-300">
                Get your favorite book recommendations instantly! Just ask away.
              </span>
            </motion.p>
          </>
        ) : (

          // chatbox
          <motion.div
            className="text-xl text-gray-800 dark:text-gray-900 min-h-[100px] max-w-2xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full max-w-2xl space-y-4 text-left">
              {chatHistory.map((entry, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
                  <div className='w-[80%] bg-gray-800 p-2 mb-2'>
                    <p className="text-blue-600 dark:text-blue-300 font-semibold">You:</p>
                    <p className="text-gray-800 dark:text-gray-100 mb-2 text-base">{entry.user}</p>
                  </div>
                  <div className='flex justify-end'>
                    <div className='w-[80%] bg-gray-800 p-2'>
                      <p className="text-green-600 dark:text-green-300 font-semibold text-end">Buddy:</p>
                      <p className="text-gray-900 dark:text-gray-50 text-start text-base">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {entry.bot}
                        </ReactMarkdown>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* input box */}
        <div className="flex items-center gap-3 mt-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Ask anything here..."
            className="flex-grow resize-none bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 overflow-hidden max-h-48"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
          >
            Send
          </motion.button>
        </div>

      </div>
    </motion.section>
  );
};

export default HeroSection;