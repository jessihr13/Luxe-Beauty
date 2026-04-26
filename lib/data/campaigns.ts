// Marketing Campaigns Data Model
export type CampaignType = 'social_media' | 'email' | 'influencer' | 'ads' | 'events';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Campaign {
    id: string;
    name: string;
    description: string;
    type: CampaignType;
    status: CampaignStatus;
    budget: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    targetAudience: string;
    goals: string[];
    metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CampaignExpense {
    id: string;
    campaignId: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
}

export interface CampaignSale {
    id: string;
    campaignId: string;
    orderId: string;
    customerName: string;
    amount: number;
    date: Date;
    source: string;
}

// Sample data
export const campaigns: Campaign[] = [
    {
        id: 'camp_001',
        name: 'Black Friday 2024',
        description: 'Campaña de descuentos especiales para Black Friday con anuncios en redes sociales',
        type: 'ads',
        status: 'active',
        budget: 15000,
        spent: 12500,
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-30'),
        targetAudience: 'Mujeres 25-45 años, interesadas en belleza premium',
        goals: ['Aumentar ventas 50%', 'Adquirir 500 nuevos clientes', 'ROI > 300%'],
        metrics: {
            impressions: 450000,
            clicks: 18500,
            conversions: 892
        },
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-28')
    },
    {
        id: 'camp_002',
        name: 'Influencer Partnership - Beauty Gurus',
        description: 'Colaboración con 5 influencers de belleza para promocionar línea de skincare',
        type: 'influencer',
        status: 'completed',
        budget: 8000,
        spent: 7800,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        targetAudience: 'Seguidores de influencers de belleza, 18-35 años',
        goals: ['Generar 1M impresiones', 'Aumentar awareness 40%', 'ROI > 200%'],
        metrics: {
            impressions: 1250000,
            clicks: 32000,
            conversions: 645
        },
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-11-01')
    },
    {
        id: 'camp_003',
        name: 'Email Newsletter - Exclusive Offers',
        description: 'Newsletter semanal con ofertas exclusivas y tips de belleza',
        type: 'email',
        status: 'active',
        budget: 3000,
        spent: 1850,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-12-31'),
        targetAudience: 'Base de clientes existentes (15,000 suscriptores)',
        goals: ['Open rate > 25%', 'CTR > 5%', 'Generar $20,000 en ventas'],
        metrics: {
            impressions: 75000,
            clicks: 4200,
            conversions: 234
        },
        createdAt: new Date('2024-10-25'),
        updatedAt: new Date('2024-11-28')
    },
    {
        id: 'camp_004',
        name: 'Instagram Stories - Daily Tips',
        description: 'Contenido diario en Instagram Stories con tips de maquillaje y skincare',
        type: 'social_media',
        status: 'active',
        budget: 5000,
        spent: 3200,
        startDate: new Date('2024-11-10'),
        endDate: new Date('2024-12-10'),
        targetAudience: 'Seguidores de Instagram, principalmente millennials',
        goals: ['Aumentar engagement 30%', 'Ganar 2,000 seguidores', 'Generar tráfico web'],
        metrics: {
            impressions: 280000,
            clicks: 8900,
            conversions: 156
        },
        createdAt: new Date('2024-11-05'),
        updatedAt: new Date('2024-11-28')
    },
    {
        id: 'camp_005',
        name: 'Launch Event - New Collection',
        description: 'Evento de lanzamiento presencial para nueva colección de fragancias',
        type: 'events',
        status: 'draft',
        budget: 12000,
        spent: 0,
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-15'),
        targetAudience: 'VIP customers, influencers, prensa de belleza',
        goals: ['Generar buzz en redes', 'Ventas anticipadas $30,000', 'Cobertura en 10+ medios'],
        metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0
        },
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-20')
    }
];

export const campaignExpenses: CampaignExpense[] = [
    // Black Friday
    { id: 'exp_001', campaignId: 'camp_001', description: 'Facebook Ads', amount: 5000, date: new Date('2024-11-15'), category: 'Publicidad Digital' },
    { id: 'exp_002', campaignId: 'camp_001', description: 'Instagram Ads', amount: 4500, date: new Date('2024-11-16'), category: 'Publicidad Digital' },
    { id: 'exp_003', campaignId: 'camp_001', description: 'Google Ads', amount: 3000, date: new Date('2024-11-18'), category: 'Publicidad Digital' },

    // Influencer Partnership
    { id: 'exp_004', campaignId: 'camp_002', description: 'Pago Influencer 1', amount: 2000, date: new Date('2024-10-01'), category: 'Influencers' },
    { id: 'exp_005', campaignId: 'camp_002', description: 'Pago Influencer 2', amount: 1800, date: new Date('2024-10-05'), category: 'Influencers' },
    { id: 'exp_006', campaignId: 'camp_002', description: 'Pago Influencer 3', amount: 1500, date: new Date('2024-10-08'), category: 'Influencers' },
    { id: 'exp_007', campaignId: 'camp_002', description: 'Productos para influencers', amount: 1200, date: new Date('2024-09-28'), category: 'Productos' },
    { id: 'exp_008', campaignId: 'camp_002', description: 'Envíos y logística', amount: 1300, date: new Date('2024-09-30'), category: 'Logística' },

    // Email Newsletter
    { id: 'exp_009', campaignId: 'camp_003', description: 'Mailchimp subscription', amount: 850, date: new Date('2024-11-01'), category: 'Software' },
    { id: 'exp_010', campaignId: 'camp_003', description: 'Diseño de templates', amount: 1000, date: new Date('2024-10-28'), category: 'Diseño' },

    // Instagram Stories
    { id: 'exp_011', campaignId: 'camp_004', description: 'Contenido creativo', amount: 1500, date: new Date('2024-11-10'), category: 'Contenido' },
    { id: 'exp_012', campaignId: 'camp_004', description: 'Instagram Ads boost', amount: 1700, date: new Date('2024-11-15'), category: 'Publicidad Digital' }
];

export const campaignSales: CampaignSale[] = [
    // Black Friday
    { id: 'sale_001', campaignId: 'camp_001', orderId: 'LB-2024-001', customerName: 'Ana Martínez', amount: 384.97, date: new Date('2024-11-20'), source: 'Facebook Ad' },
    { id: 'sale_002', campaignId: 'camp_001', orderId: 'LB-2024-002', customerName: 'Carlos Rodríguez', amount: 329.99, date: new Date('2024-11-21'), source: 'Instagram Ad' },
    { id: 'sale_003', campaignId: 'camp_001', orderId: 'LB-2024-003', customerName: 'Laura Sánchez', amount: 409.96, date: new Date('2024-11-22'), source: 'Google Ad' },
    { id: 'sale_004', campaignId: 'camp_001', orderId: 'LB-2024-004', customerName: 'Roberto Gómez', amount: 307.98, date: new Date('2024-11-23'), source: 'Facebook Ad' },
    { id: 'sale_005', campaignId: 'camp_001', orderId: 'LB-2024-005', customerName: 'María López', amount: 445.50, date: new Date('2024-11-24'), source: 'Instagram Ad' },
    { id: 'sale_006', campaignId: 'camp_001', orderId: 'LB-2024-006', customerName: 'Diego Torres', amount: 298.75, date: new Date('2024-11-25'), source: 'Google Ad' },
    { id: 'sale_007', campaignId: 'camp_001', orderId: 'LB-2024-007', customerName: 'Sofia Ramírez', amount: 512.30, date: new Date('2024-11-26'), source: 'Facebook Ad' },
    { id: 'sale_008', campaignId: 'camp_001', orderId: 'LB-2024-008', customerName: 'Pedro Hernández', amount: 367.80, date: new Date('2024-11-27'), source: 'Instagram Ad' },

    // Influencer Partnership
    { id: 'sale_009', campaignId: 'camp_002', orderId: 'LB-2024-009', customerName: 'Valentina Cruz', amount: 289.99, date: new Date('2024-10-10'), source: 'Influencer Link' },
    { id: 'sale_010', campaignId: 'camp_002', orderId: 'LB-2024-010', customerName: 'Andrés Morales', amount: 425.50, date: new Date('2024-10-12'), source: 'Influencer Link' },
    { id: 'sale_011', campaignId: 'camp_002', orderId: 'LB-2024-011', customerName: 'Camila Vargas', amount: 356.75, date: new Date('2024-10-15'), source: 'Influencer Code' },
    { id: 'sale_012', campaignId: 'camp_002', orderId: 'LB-2024-012', customerName: 'Lucas Mendoza', amount: 478.20, date: new Date('2024-10-18'), source: 'Influencer Link' },

    // Email Newsletter
    { id: 'sale_013', campaignId: 'camp_003', orderId: 'LB-2024-013', customerName: 'Isabella Rojas', amount: 234.99, date: new Date('2024-11-05'), source: 'Email Link' },
    { id: 'sale_014', campaignId: 'camp_003', orderId: 'LB-2024-014', customerName: 'Mateo Silva', amount: 389.50, date: new Date('2024-11-12'), source: 'Email Link' },
    { id: 'sale_015', campaignId: 'camp_003', orderId: 'LB-2024-015', customerName: 'Emma Castillo', amount: 267.80, date: new Date('2024-11-19'), source: 'Email Promo Code' },

    // Instagram Stories
    { id: 'sale_016', campaignId: 'camp_004', orderId: 'LB-2024-016', customerName: 'Sebastián Ortiz', amount: 198.99, date: new Date('2024-11-15'), source: 'Instagram Story Link' },
    { id: 'sale_017', campaignId: 'camp_004', orderId: 'LB-2024-017', customerName: 'Mia Flores', amount: 345.60, date: new Date('2024-11-20'), source: 'Instagram Story Link' },
    { id: 'sale_018', campaignId: 'camp_004', orderId: 'LB-2024-018', customerName: 'Nicolás Reyes', amount: 412.25, date: new Date('2024-11-25'), source: 'Instagram Bio Link' }
];

// Helper functions
export function getAllCampaigns(): Campaign[] {
    return campaigns;
}

export function getCampaignById(id: string): Campaign | undefined {
    return campaigns.find(c => c.id === id);
}

export function getCampaignExpenses(campaignId: string): CampaignExpense[] {
    return campaignExpenses.filter(e => e.campaignId === campaignId);
}

export function getCampaignSales(campaignId: string): CampaignSale[] {
    return campaignSales.filter(s => s.campaignId === campaignId);
}

// Calculate campaign metrics
export function calculateCampaignROI(campaignId: string): number {
    const campaign = getCampaignById(campaignId);
    if (!campaign) return 0;

    const sales = getCampaignSales(campaignId);
    const revenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const cost = campaign.spent;

    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
}

export function calculateCampaignRevenue(campaignId: string): number {
    const sales = getCampaignSales(campaignId);
    return sales.reduce((sum, s) => sum + s.amount, 0);
}

export function calculateCPA(campaignId: string): number {
    const campaign = getCampaignById(campaignId);
    if (!campaign || campaign.metrics.conversions === 0) return 0;

    return campaign.spent / campaign.metrics.conversions;
}

export function calculateROAS(campaignId: string): number {
    const campaign = getCampaignById(campaignId);
    if (!campaign || campaign.spent === 0) return 0;

    const revenue = calculateCampaignRevenue(campaignId);
    return revenue / campaign.spent;
}

export function calculateCTR(campaignId: string): number {
    const campaign = getCampaignById(campaignId);
    if (!campaign || campaign.metrics.impressions === 0) return 0;

    return (campaign.metrics.clicks / campaign.metrics.impressions) * 100;
}

export function calculateConversionRate(campaignId: string): number {
    const campaign = getCampaignById(campaignId);
    if (!campaign || campaign.metrics.clicks === 0) return 0;

    return (campaign.metrics.conversions / campaign.metrics.clicks) * 100;
}

// Campaign type info
export const campaignTypeInfo: Record<CampaignType, { name: string; icon: string; color: string }> = {
    social_media: { name: 'Redes Sociales', icon: '📱', color: 'blue' },
    email: { name: 'Email Marketing', icon: '📧', color: 'green' },
    influencer: { name: 'Influencers', icon: '⭐', color: 'purple' },
    ads: { name: 'Publicidad Digital', icon: '🎯', color: 'red' },
    events: { name: 'Eventos', icon: '🎉', color: 'yellow' }
};

// Campaign status info
export const campaignStatusInfo: Record<CampaignStatus, { name: string; icon: string; color: string }> = {
    draft: { name: 'Borrador', icon: '📝', color: 'gray' },
    active: { name: 'Activa', icon: '🟢', color: 'green' },
    paused: { name: 'Pausada', icon: '⏸️', color: 'yellow' },
    completed: { name: 'Completada', icon: '✅', color: 'blue' }
};

// CRUD operations (simulated)
export function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
    const newCampaign: Campaign = {
        ...campaign,
        id: `camp_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    campaigns.push(newCampaign);
    return newCampaign;
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;

    campaigns[index] = {
        ...campaigns[index],
        ...updates,
        updatedAt: new Date()
    };
    return campaigns[index];
}

export function deleteCampaign(id: string): boolean {
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return false;

    campaigns.splice(index, 1);
    return true;
}

// Attribution function - links orders to campaigns
export function attributeSaleToCampaign(
    orderId: string,
    customerName: string,
    amount: number,
    campaignId: string,
    source: string
): CampaignSale {
    const newSale: CampaignSale = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        campaignId,
        orderId,
        customerName,
        amount,
        date: new Date(),
        source
    };

    campaignSales.push(newSale);
    return newSale;
}

// Get all attribution sources
export const attributionSources = [
    { value: 'facebook_ad', label: 'Facebook Ad', icon: '📘' },
    { value: 'instagram_ad', label: 'Instagram Ad', icon: '📷' },
    { value: 'google_ad', label: 'Google Ad', icon: '🔍' },
    { value: 'email_campaign', label: 'Email Campaign', icon: '📧' },
    { value: 'influencer_link', label: 'Influencer Link', icon: '⭐' },
    { value: 'instagram_story', label: 'Instagram Story', icon: '📱' },
    { value: 'tiktok_ad', label: 'TikTok Ad', icon: '🎵' },
    { value: 'youtube_ad', label: 'YouTube Ad', icon: '📺' },
    { value: 'organic', label: 'Orgánico', icon: '🌱' },
    { value: 'direct', label: 'Directo', icon: '🔗' },
    { value: 'referral', label: 'Referido', icon: '👥' },
    { value: 'other', label: 'Otro', icon: '📌' }
] as const;
