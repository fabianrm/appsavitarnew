export interface Enterprise {
    id: number;
    ruc: string;
    name: string;
    city: City;
    address: string;
    phone: null;
    logo: string;
    status: boolean;
    telegramBotToken: string | null;
    telegramChatId: string | null;
    whatsappRemindersEnabled: boolean;
    waInstance: string | null;
    waApiKey: string | null;
    waReminderDaysBefore: number;
    waPaymentInfo: string | null;
    waMessageTemplateDue: string | null;
    waMessageTemplateOverdue: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface City {
    id: number;
    name: string;
    coordinates: [number, number];
}

export interface EnterpriseResponse {
    data: Enterprise[];
}
