export type Status = 'up' | 'down' | 'balance' | 'normal';

export type Price = { status: Status; value: string };
