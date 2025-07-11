// src/context/PublicationContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";
import { debounce } from 'lodash';

const PublicationContext = createContext(null);

const initialPublications = [
    {
        id: 1,
        title: 'Statistik Air Bersih Provinsi Bengkulu 2023',
        releaseDate: '2023-05-01',
        description: 'Publikasi ini menyajikan data dan analisis mengenai akses rumah tangga terhadap sumber air minum layak...',
        coverUrl: 'https://res.cloudinary.com/djcm0swgo/image/upload/v1751734373/statistik-air-bersih-2023_1_beeat9.webp',
    },
    {
        id: 2,
        title: 'Statistik Air Bersih Provinsi Bengkulu 2022',
        releaseDate: '2022-05-01',
        description: 'Publikasi ini menyajikan data dan analisis mengenai akses rumah tangga terhadap sumber air minum layak...',
        coverUrl: 'https://res.cloudinary.com/djcm0swgo/image/upload/v1751734413/statistik-air-bersih -2022_1_monxa5.webp',
    },
    {
        id: 3,
        title: 'Statistik Air Bersih Provinsi Bengkulu 2021',
        releaseDate: '2021-05-01',
        description: 'Data dan analisis mengenai akses rumah tangga terhadap sumber air minum layak...',
        coverUrl: 'https://res.cloudinary.com/djcm0swgo/image/upload/v1751734440/statistik-air-bersih -2021_1_jo5pa3.webp',
    },
];

const PublicationProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const [publications, setPublications] = useState(() => {
        const savedPublications = localStorage.getItem('publications');
        return savedPublications ? JSON.parse(savedPublications) : initialPublications;
    });
    
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const data = await publicationService.getPublications();
                setPublications(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching publications:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [token]);

    const addPublication = async (newPub) => {
        setLoading(true)
        try {
            const added = await publicationService.addPublication(newPub);
            setPublications((prev) => [added, ...prev]);
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editPublication = async (updatedPub) => {
        setLoading(true);
        try {
            await publicationService.editPublication(updatedPub.id, updatedPub);
            setPublications(prev => prev.map(pub =>
                pub.id === updatedPub.id ? updatedPub : pub
            ));
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }finally {
            setLoading(false);
        }
    };

    const deletePublication = async (id) => {
        setLoading(true)
        try {
            await publicationService.deletePublication(id);
            setPublications(prev => prev.filter(pub => pub.id !== id));
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        publications,
        loading,
        error,
        addPublication,
        editPublication,
        deletePublication,
    };

    return (
        <PublicationContext.Provider value={value}>
            {children}
        </PublicationContext.Provider>
    );
};

export { PublicationContext, PublicationProvider };