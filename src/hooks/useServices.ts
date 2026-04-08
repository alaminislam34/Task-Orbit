import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";


export interface Service {
    id: string;
    title: string;
    description: string;
    basePrice: string;
    category: string;
    seller: {
        id: string;
        title: string | null;
        rating: number;
        completedOrders: number;
    };
    imageUrls: string[];
    thumbnailUrl: string;
    imageUrl: string;
}

interface ApiResponse {
    meta: any;
    services: Service[];
}
export const useServices = () => {
    return useQuery({
        queryKey: ["services"],
        queryFn: async () => {
            const res = await httpClient.get<ApiResponse>(ENDPOINT.SELLER.SERVICES);
            const services = res.data.services || [];
            return services.map(service => ({
                ...service,
                slug: service.id,
                media: {
                    thumbnail: service.thumbnailUrl || service.imageUrl || "/images/placeholder.jpg",
                },
                packages: [
                    {
                        price: service.basePrice,
                        deliveryTime: 3 // Default fallback
                    }
                ],
                seller: {
                    ...service.seller,
                    name: service.seller?.title || "Seller",
                    avatar: "",
                    level: "New Seller"
                },
                rating: service.seller?.rating || 0,
                reviewCount: service.seller?.completedOrders || 0,
                isPro: false,
                isVerified: true
            }));
        },
    });
};
