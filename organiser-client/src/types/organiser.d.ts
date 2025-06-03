type OrganiserProfile = {
    firstName: string;
    lastName: string;
    location?: string | null;
    orgName: string;
    logoImage: string;
    bannerImage: string;
    description?: string | null;
    displayEmail: string | null;
    socials?: {
        twitter?: string | null;
        facebook?: string | null;
        instagram?: string | null;
        linkedin?: string | null;
    } | null;
    website?: string | null;
    userId: string;
};
export type { OrganiserProfile };
