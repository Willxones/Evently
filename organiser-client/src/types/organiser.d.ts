type OrganiserProfile = {
    organiserName: string;
    firstName: string;
    lastName: string;
    description: string;
    location?: string | null;
    logoImage: string;
    bannerImage: string;
    publicEmail: string | null;
    socialLinks?: {
        twitter?: string | null;
        facebook?: string | null;
        instagram?: string | null;
        linkedin?: string | null;
    } | null;
    websiteUrl?: string | null;
    userId: string;
};
export type { OrganiserProfile };
