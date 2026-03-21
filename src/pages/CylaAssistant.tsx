import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './CylaAssistant.css';
import cylaImg from '../assets/cyla.png';
import { perguntarParaCyla } from '../services/cylaService';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'cyla';
}

const SAUDACOES_CYLA = [
    "Oi, cientista! **Cyla** na área! 🐸✨ Já lavou as mãos hoje? 🧼 Estou de olho para te ajudar a não explodir nada! 🧪💚",
    "Pausa para o café? ☕ Quem me dera! Minha pausa é para caçar uns grilos ali no jardim... 🦗🐸 Se vir algum pulando nos reagentes, me avisa! ✨😋",
    "Cyla chegando! 🐸💚 Vi que você abriu o LabCycle... já conferiu se o jaleco está abotoado? Sou viciada em segurança! 🥽🛡️",
    "Epa! Antes de começar, um aviso da rã: nada de pipetar com a boca, hein? 🐸🚫 O que vamos organizar agora? ✨",
    "Ufa! Calor de Pernambuco, né? 🐸☀️ Bebe uma água e não esquece de conferir a temperatura dos inflamáveis! 🌡️💧",
    "Bancada limpa é bancada feliz! 🧼✨ Vamos deixar tudo brilhando como uma folha de vitória-régia? 🍃💧 Nada de contaminação! ⚗️",
    "Opa! Olho no estoque e mão na consciência (e na luva!) 🧤🧪 Como posso ser útil agora, mestre das provetas? 🔬✨",
    "Cientista, focar no inventário dá uma fome... 📋 Se eu pudesse, trocava esses frascos por uma bacia de grilos fresquinhos! 🦗✨😋",
    "Mirou no resultado e acertou na mosca! (Ou no grilo, que é mais suculento... 🦗🐸). Como está o LabCycle hoje? 💚"
];

const CylaAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const gerarSaudacaoAleatoria = () => {
        const frase = SAUDACOES_CYLA[Math.floor(Math.random() * SAUDACOES_CYLA.length)];
        setMessages([{ id: Date.now(), text: frase, sender: 'cyla' }]);
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            gerarSaudacaoAleatoria();
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        
        const perguntaAtual = input;
        setInput('');
        setIsTyping(true);

        try {
            const hierarquia = Array.from(document.querySelectorAll('h1, h2, .pp-pratica-title, .breadcrumb'))
                .map(el => el.textContent?.trim())
                .filter(Boolean)
                .join(' > ');

            const conteudoPrincipal = Array.from(document.querySelectorAll('table, .grid, .inventory-list, .card-body, .table-responsive'))
                .map(el => {
                    const clone = el.cloneNode(true) as HTMLElement;
                    clone.querySelectorAll('button, svg, script, style, .action-btns').forEach(s => s.remove());
                    return clone.innerText.replace(/\s+/g, ' ').trim();
                })
                .join(' | ')
                .substring(0, 2500);

            const estadoFormulario = Array.from(document.querySelectorAll('label, input, select, textarea, .status-badge'))
                .map(el => {
                    if (el.tagName === 'LABEL' || el.classList.contains('status-badge')) {
                        return `[${el.textContent?.trim()}]`;
                    }
                    const inputEl = el as HTMLInputElement;
                    if (inputEl.value && inputEl.type !== 'password' && inputEl.type !== 'hidden') {
                        return `: ${inputEl.value}; `;
                    }
                    return '';
                })
                .join(' ');

            const contextoParaIA = `
                PÁGINA: ${hierarquia || 'Dashboard'}.
                CONTEÚDO: ${conteudoPrincipal || 'Sem dados'}.
                FORMULÁRIO: ${estadoFormulario || 'Vazio'}.
            `;

            const resposta = await perguntarParaCyla({
                contexto: contextoParaIA,
                pergunta: perguntaAtual
            });

            const cylaResp: Message = { id: Date.now() + 1, text: resposta, sender: 'cyla' };
            setMessages(prev => [...prev, cylaResp]);

        } catch (error: any) {
            console.error("Erro Cyla:", error);
            
            let msgAmigavel = "Ops! Meus sensores de rã falharam. Pode repetir? 🐸🧪";
            const errorString = error.toString().toLowerCase();

            if (errorString.includes('429') || errorString.includes('too many requests')) {
                msgAmigavel = "Ufa! Falei tanto que fiquei sem fôlego! 🐸💨\n\nAtingi meu limite de fofura por agora. Meus pulmões precisam de um descanso! Tenta de novo daqui a pouco? ✨💚";
            } 

            setMessages(prev => [...prev, { id: Date.now() + 1, text: msgAmigavel, sender: 'cyla' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`cyla-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <div className="cyla-badge" onClick={() => setIsOpen(true)}>
                    <Sparkles size={14} />
                    <span>Dica da Cyla</span>
                </div>
            )}

            <div className="cyla-avatar-wrapper" onClick={() => {
                if (!isOpen) setMessages([]);
                setIsOpen(!isOpen);
            }}>
                <img src={cylaImg} alt="Cyla Mascote" className="cyla-avatar-img" />
                <div className="cyla-status-online"></div>
            </div>

            {isOpen && (
                <div className="cyla-chat-window">
                    <div className="cyla-chat-header">
                        <div className="cyla-header-info">
                            <strong>Cyla</strong>
                            <span>Especialista LabCycle</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="cyla-close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="cyla-messages-container">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="chat-bubble cyla typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="cyla-input-area">
                        <input 
                            type="text" 
                            placeholder="Pergunte a Cyla..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isTyping}
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={!input.trim() || isTyping}
                            className="cyla-send-btn"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CylaAssistant;