import React, { useState, useCallback, useRef } from 'react';
import { Upload, Camera, X, Fish, Loader2, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

const MarineClassifier: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showSpecies, setShowSpecies] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    const resetState = () => {
        setSelectedFile(null);
        setPreview(null);
        setPrediction(null);
        setError(null);
    };

    const handleFileSelect = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPrediction(null);
            setError(null);

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result;
                setPreview(typeof result === 'string' ? result : null);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please select a valid image file.');
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFileSelect(f);
    };

    // call to backend to classify the image
    const predictImage = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('${API_BASE_URL}/predict', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Prediction failed. Please try again.');
            } else {
                setPrediction(data.prediction as string);
            }
        } catch (err) {
            setError('Network error. Make sure the API server is running.');
        } finally {
            setLoading(false);
        }
    };

    const getAnimalEmoji = (animal: string): string => {
        const emojiMap: Record<string, string>  = {
        'Fish': '🐟', 'Sharks': '🦈', 'Whale': '🐋', 'Dolphin': '🐬',
        'Octopus': '🐙', 'Squid': '🦑', 'Crabs': '🦀', 'Lobster': '🦞',
        'Shrimp': '🦐', 'Turtle_Tortoise': '🐢', 'Penguin': '🐧',
        'Seal': '🦭', 'Otter': '🦦', 'Starfish': '⭐', 'Jelly Fish': '🪼',
        'Seahorse': '🌊', 'Puffers': '🐡', 'Clams': '🐚', 'Corals': '🪸',
        'Eel': '🐍', 'Nudibranchs': '🐛', 'Sea Rays': '🐟', 'Sea Urchins': '🔴'
        };
        return emojiMap[animal] || '🌊';
    };

    return ()

};