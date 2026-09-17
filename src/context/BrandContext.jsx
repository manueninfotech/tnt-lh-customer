import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import settingsService from '../services/settingsService';

const BrandContext = createContext();

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
    const location = useLocation();

    const [brand, setBrandState] = useState('teasntrees');
    const [isLittleHActive, setIsLittleHActive] = useState(true);

    const fetchBrandStatus = async () => {
        try {
            const res = await settingsService.getBrandsStatus();
            if (res?.success && res?.data?.littleh) {
                const active = res.data.littleh.isStoreActive !== false;
                setIsLittleHActive(active);
            }
        } catch (err) {
            console.error('Error checking brand status:', err);
        }
    };

    useEffect(() => {
        fetchBrandStatus();
    }, []);

    // Auto-detect brand from URL path & handle Little H disabled redirection
    useEffect(() => {
        const path = location.pathname;
        const urlBrand = path.split('/')[1]?.toLowerCase();

        // If Little H is disabled and customer tries to access /littleh routes, redirect to /teasntrees
        if (urlBrand === 'littleh' && !isLittleHActive) {
            window.location.replace('/teasntrees');
            return;
        }

        if (urlBrand === 'littleh' || urlBrand === 'teasntrees') {
            setBrandState(urlBrand);
        } else {
            // Default to teasntrees if no valid brand in URL
            setBrandState('teasntrees');
        }
    }, [location.pathname, isLittleHActive]);

    // setBrand is now mostly to handle programmatic navigation if needed
    const setBrand = (newBrand) => {
        if (newBrand === 'littleh' && !isLittleHActive) {
            return; // Prevent navigating to Little H if turned off
        }
        if (newBrand && newBrand !== brand) {
            window.location.href = `/${newBrand}`;
        }
    };

    // Derived theme variables
    const theme = {
        isLittleH: brand === 'littleh',
        isTeasNTrees: brand === 'teasntrees',
        primaryColorClass: brand === 'littleh' ? 'bg-bakery-primary' : 'bg-cafe-emerald',
        primaryHoverClass: brand === 'littleh' ? 'hover:bg-bakery-accent' : 'hover:bg-emerald-700',
        textColorClass: brand === 'littleh' ? 'text-bakery-primary' : 'text-cafe-emerald',
        bgLightClass: brand === 'littleh' ? 'bg-bakery-light' : 'bg-emerald-50',
        gradientClass: brand === 'littleh' ? 'from-bakery-primary to-bakery-accent' : 'from-cafe-emerald to-cafe-teal',
        gradientHoverClass: brand === 'littleh' ? 'hover:shadow-bakery-primary/40' : 'hover:shadow-cafe-emerald/40',
        shadowClass: brand === 'littleh' ? 'shadow-bakery-primary/30' : 'shadow-cafe-emerald/30',
        brandName: brand === 'littleh' ? 'LittleH Bakery' : 'Teas N Trees',
    };

    return (
        <BrandContext.Provider value={{ brand, setBrand, theme, isLittleHActive, refreshBrandStatus: fetchBrandStatus }}>
            {children}
        </BrandContext.Provider>
    );
};
