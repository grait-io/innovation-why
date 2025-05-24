import { Order } from '@/types/shopware.types';
import { create } from 'zustand';

// Typ für den Zustand des Stores
interface AppStore {
    loading: boolean;
    setLoading: (isLoading: boolean) => void;

    isModalOpen: boolean;
    setModalText: (content: string) => void;
    modalText: string;
    setModalOrder: (content: Order | undefined) => void;
    modalOrder: Order | undefined;
    setModalOpen: (isOpen: boolean) => void;
}

const useAppStore = create<AppStore>((set) => ({
    // loading store
    loading: false,
    setLoading: (isLoading) => set({ loading: isLoading }),

    // modal store
    isModalOpen: false,
    modalText: '',
    setModalText: (content) => set({ modalText: content }),
    modalOrder: undefined,
    // TODO: check naming. setSelectedOrder
    setModalOrder: (order) => set({ modalOrder: order }),

    setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));

export default useAppStore;
