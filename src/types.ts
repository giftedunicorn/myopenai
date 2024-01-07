export type Message = {
    id: string;
    text: string;
    createdAt?: Date;
    role: 'system' | 'user' | 'assistant';
};