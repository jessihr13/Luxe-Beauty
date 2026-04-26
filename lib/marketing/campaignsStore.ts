/**
 * Campaigns Store - Manages marketing campaigns
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CampaignType = 'email' | 'social' | 'influencer' | 'paid_ads' | 'seo' | 'content';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    budget: number;
    spent: number;
    startDate: string;
    endDate?: string;
    description?: string;
    targetAudience?: string;
    metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
    };
    createdAt: string;
}

export interface CampaignAttribution {
    orderId: string;
    orderNumber: string;
    campaignId: string;
    customerName: string;
    revenue: number;
    source: string;
    createdAt: string;
}

interface CampaignsStore {
    campaigns: Campaign[];
    attributions: CampaignAttribution[];
    addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    getCampaignById: (id: string) => Campaign | undefined;
    getAllCampaigns: () => Campaign[];
    getActiveCampaigns: () => Campaign[];
    attributeSaleToCampaign: (orderNumber: string, customerName: string, revenue: number, campaignId: string, source: string) => void;
    getCampaignAttributions: (campaignId: string) => CampaignAttribution[];
}

export const attributionSources = [
    'Facebook Ad',
    'Instagram Ad',
    'Google Ads',
    'Email Campaign',
    'Influencer',
    'Organic Search',
    'Direct',
    'Other'
];

export const campaignTypeInfo: Record<CampaignType, { name: string; icon: string }> = {
    email: { name: 'Email', icon: '📧' },
    social: { name: 'Redes Sociales', icon: '📱' },
    influencer: { name: 'Influencers', icon: '⭐' },
    paid_ads: { name: 'Publicidad', icon: '🎯' },
    seo: { name: 'SEO', icon: '🔍' },
    content: { name: 'Contenido', icon: '📝' },
};

export const campaignStatusInfo: Record<CampaignStatus, { name: string; icon: string }> = {
    draft: { name: 'Borrador', icon: '📝' },
    active: { name: 'Activa', icon: '🟢' },
    paused: { name: 'Pausada', icon: '⏸️' },
    completed: { name: 'Completada', icon: '✅' },
};

export const useCampaignsStore = create<CampaignsStore>()(
    persist(
        (set, get) => ({
            campaigns: [],
            attributions: [],

            addCampaign: (campaignData) => {
                const newCampaign: Campaign = {
                    ...campaignData,
                    id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };

                set({ campaigns: [...get().campaigns, newCampaign] });
                console.log('✅ Campaign added:', newCampaign.name);
            },

            updateCampaign: (id, updates) => {
                set({
                    campaigns: get().campaigns.map(campaign =>
                        campaign.id === id
                            ? { ...campaign, ...updates }
                            : campaign
                    )
                });
            },

            deleteCampaign: (id) => {
                set({
                    campaigns: get().campaigns.filter(campaign => campaign.id !== id)
                });
            },

            getCampaignById: (id) => {
                return get().campaigns.find(c => c.id === id);
            },

            getAllCampaigns: () => {
                return get().campaigns.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            },

            getActiveCampaigns: () => {
                return get().campaigns.filter(c => c.status === 'active');
            },

            attributeSaleToCampaign: (orderNumber, customerName, revenue, campaignId, source) => {
                const newAttribution: CampaignAttribution = {
                    orderId: `ord_${Date.now()}`,
                    orderNumber,
                    campaignId,
                    customerName,
                    revenue,
                    source,
                    createdAt: new Date().toISOString(),
                };

                set({ attributions: [...get().attributions, newAttribution] });

                // Update campaign metrics
                set({
                    campaigns: get().campaigns.map(campaign =>
                        campaign.id === campaignId
                            ? {
                                ...campaign,
                                metrics: {
                                    ...campaign.metrics,
                                    conversions: campaign.metrics.conversions + 1,
                                    revenue: campaign.metrics.revenue + revenue
                                }
                            }
                            : campaign
                    )
                });
            },

            getCampaignAttributions: (campaignId) => {
                return get().attributions.filter(a => a.campaignId === campaignId);
            }
        }),
        {
            name: 'luxe-campaigns-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
