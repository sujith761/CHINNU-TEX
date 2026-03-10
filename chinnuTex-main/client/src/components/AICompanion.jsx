import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotApi } from '../services/api';
import './AICompanion.css';

export default function AICompanion() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, thinking, listening, speaking
    const [quickReplies, setQuickReplies] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
    const finalRef = useRef('');
    const commandTimeoutRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onstart = () => {
            setIsListening(true);
            setStatus('listening');
            finalRef.current = '';
        };

        recog.onresult = (e) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const txt = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    finalRef.current = (finalRef.current ? finalRef.current + ' ' : '') + txt;
                    setTranscript((prev) => (prev ? prev + ' ' : '') + txt);
                } else {
                    interim += txt;
                }
            }
        };

        recog.onerror = () => {
            setIsListening(false);
            setStatus('idle');
        };

        recog.onend = () => {
            setIsListening(false);
            if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
            commandTimeoutRef.current = setTimeout(() => {
                const finalText = finalRef.current.trim();
                if (finalText) {
                    handleVoiceCommand(finalText);
                }
                finalRef.current = '';
                setTranscript('');
                if (status === 'listening') setStatus('idle');
            }, 100);
        };

        recognitionRef.current = recog;
    }, [status]);

    // Initialize chatbot session
    useEffect(() => {
        if (isOpen) {
            if (!sessionId) {
                initiateChatbot();
            }
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initiateChatbot = async () => {
        try {
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);

            const data = await chatbotApi.initiateChatbot({ sessionId: newSessionId });
            setMessages([{ sender: 'bot', text: data.greeting }]);

            setQuickReplies([
                { id: 1, text: '🧵 Sizing Services', value: 'sizing' },
                { id: 2, text: '🏭 Weaving Services', value: 'weaving' },
                { id: 3, text: '💰 View Pricing', value: 'pricing' },
                { id: 4, text: '❓ Help & FAQ', value: 'help' }
            ]);
        } catch (error) {
            console.error('Error initializing chatbot:', error);
        }
    };

    const handleVoiceCommand = (text) => {
        const q = text.toLowerCase();

        // Navigation check first
        const go = (path, say) => {
            navigate(path);
            speak(say || 'Opening');
            setMessages(prev => [...prev, { sender: 'user', text: `Command: ${text}` }, { sender: 'bot', text: say || 'Opening requested page.' }]);
        };

        if (/home|main( menu)?/.test(q)) return go('/', 'Going to home');
        if (/sizing|size ing|yarn/.test(q)) return go('/products/sizing', 'Opening sizing');
        if (/weaving|fabric/.test(q)) return go('/products/weaving', 'Opening weaving');
        if (/booking|book now/.test(q)) return go('/booking', 'Opening booking');
        if (/contact|support/.test(q)) return go('/contact', 'Opening contact');
        if (/my orders?/.test(q)) return go('/my-orders', 'Opening your orders');

        // If not navigation, send to bot
        sendMessageToBot(text);
    };

    const speak = (text) => {
        if (!voiceEnabled || !synthRef.current) return;
        try {
            synthRef.current.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            u.onstart = () => setStatus('speaking');
            u.onend = () => setStatus('idle');
            synthRef.current.speak(u);
        } catch { }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (!isOpen) setIsOpen(true);
            recognitionRef.current?.start();
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !sessionId) return;
        sendMessageToBot(inputValue.trim());
        setInputValue('');
    };

    const sendMessageToBot = async (userMessage) => {
        if (!userMessage || !sessionId) return;

        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        if (!isOpen) {
            setUnreadCount(prev => prev + 1);
        }
        setStatus('thinking');
        setQuickReplies([]);

        try {
            const data = await chatbotApi.chatbotMessage({ sessionId, message: userMessage });
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);

            if (voiceEnabled) speak(data.response);
            else setStatus('idle');

            updateQuickReplies(userMessage, data.response);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Connection lost. I am here but having trouble reaching the server.' }]);
            setStatus('idle');
        }
    };

    const updateQuickReplies = (userMsg, botResponse) => {
        const lowerMsg = userMsg.toLowerCase();
        const lowerRes = botResponse.toLowerCase();

        if (lowerMsg.includes('main') || lowerRes.includes('welcome')) {
            setQuickReplies([
                { id: 1, text: '🧵 Sizing', value: 'sizing' },
                { id: 2, text: '🏭 Weaving', value: 'weaving' },
                { id: 3, text: '💰 Pricing', value: 'pricing' },
                { id: 4, text: '❓ Help', value: 'help' }
            ]);
        } else {
            setQuickReplies([
                { id: 1, text: '📋 Back to Menu', value: 'main menu' },
                { id: 2, text: '🤝 Contact Us', value: 'contact' },
                { id: 3, text: '🛍️ Book Now', value: 'book' }
            ]);
        }
    };

    return (
        <div className={`ai-companion-container ${isOpen ? 'expanded' : ''}`}>
            {/* The Reactive Orb Trigger */}
            <button
                className={`orb-trigger ${status}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="AI Companion"
            >
                <div className="orb-core"></div>
                <div className="orb-ring one"></div>
                <div className="orb-ring two"></div>
                {unreadCount > 0 && !isOpen && (
                    <span className="orb-notification">{unreadCount}</span>
                )}
            </button>

            {/* Glassmorphism Hub */}
            {isOpen && (
                <div className="companion-hub">
                    <div className="hub-header">
                        <div className="orb-small-display">
                            <div className={`orb-avatar ${status}`}></div>
                        </div>
                        <div className="header-text">
                            <h2>TexGen AI</h2>
                            <span className="status-label">{status === 'idle' ? 'Ready to help' : status}</span>
                        </div>
                        <div className="header-actions">
                            <button
                                className={`voice-toggle ${voiceEnabled ? 'active' : ''}`}
                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                title="Toggle Voice Output"
                            >
                                {voiceEnabled ? '🔊' : '🔇'}
                            </button>
                            <button className="close-hub" onClick={() => setIsOpen(false)}>×</button>
                        </div>
                    </div>

                    <div className="chat-viewport">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-frame ${msg.sender}`}>
                                <div className="message-blob">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {status === 'thinking' && (
                            <div className="message-frame bot">
                                <div className="message-blob typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-action-strip">
                        {quickReplies.map(reply => (
                            <button
                                key={reply.id}
                                className="quick-btn"
                                onClick={() => sendMessageToBot(reply.value)}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="hub-input-area">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask anything..."
                            disabled={status === 'thinking'}
                        />
                        <button
                            type="button"
                            className={`mic-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleListening}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.06 2.29 5.6 5.25 5.96V21h3.5v-4.04C16.71 16.6 19 14.06 19 11h-2z" />
                            </svg>
                        </button>
                        <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
