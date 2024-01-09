import { 
    useState, 
    useCallback, 
    useRef, 
    ChangeEvent, 
    FormEvent,
    useEffect,
} from 'react';
import { Message } from '@/types';
import { createChunkDecoder, nanoid } from '@/utils';

type UseChatProps = {
    api?: string;
    id?: string;
    initialInput?: string;
    initialMessages?: Message[];
};

type UseChatHelpers = {
    messages: Message[];
    input: string;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean;
    stop: () => void;
    reload: () => void;
};

export function useChat({
    api='/api/chat',
    id,
    initialInput = '',
    initialMessages = [],
}: UseChatProps = {}) : UseChatHelpers {
    const [input, setInput] = useState(initialInput);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if (!isLoading) return

        const fetchData = async () => {
            const abortController = new AbortController()
            abortControllerRef.current = abortController

            const text = input.trim();
            if (!text) return;

            const res = await fetch(api, {
                method: 'POST',
                body: JSON.stringify({
                    prompt: text,
                }),
                signal: abortController.signal,
            })
        
            if (!res.ok) {
                throw new Error((await res.text()) || 'Failed to fetch chat messages');
            } 

            if (!res.body) {
                throw new Error('Response body is empty');
            }

            const reader = res.body.getReader()
            const decoder = createChunkDecoder()
            let result = ``

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    setIsLoading(false)
                    break
                }

                result += decoder(value)

                const newMessage: Message = {
                    id: nanoid(),
                    text: result,
                    role: 'assistant',
                    createdAt: new Date(),
                }
                setMessages([...messages, newMessage])
            }
        }

        fetchData()
    }, [isLoading])

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const text = input.trim();
        if (!text) return;

        const userMessage: Message = {
            id: nanoid(),
            text,
            role: 'user',
            createdAt: new Date(),
        };

        setIsLoading(true)
        setMessages([...messages, userMessage]);
    }, [api, input, messages]);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    const reload = useCallback(() => {
        setMessages([])
    }, [])

    return { messages, input, handleSubmit, handleInputChange, isLoading, stop, reload };
}