import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Fish,
  ChevronDown,
  Info,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Image
} from "lucide-react";

interface PredictionResponse {
  prediction: string;
  confidence?: number;
  error?: string;
}

interface TopkResult {
  label: string;
  score: number;
}

type SpeciesType = 
  | "Fish" | "Sharks" | "Whale" | "Dolphin" | "Octopus" | "Squid" | "Crabs"
  | "Lobster" | "Shrimp" | "Turtle_Tortoise" | "Penguin" | "Seal" | "Otter"
  | "Starfish" | "Jelly Fish" | "Seahorse" | "Puffers" | "Clams" | "Corals"
  | "Eel" | "Nudibranchs" | "Sea Rays" | "Sea Urchins";

const EMOJI: Record<string, string> = {
  "Fish": "🐟",
  "Sharks": "🦈",
  "Whale": "🐋",
  "Dolphin": "🐬",
  "Octopus": "🐙",
  "Squid": "🦑",
  "Crabs": "🦀",
  "Lobster": "🦞",
  "Shrimp": "🦐",
  "Turtle_Tortoise": "🐢",
  "Penguin": "🐧",
  "Seal": "🦭",
  "Otter": "🦦",
  "Starfish": "⭐",
  "Jelly Fish": "🪼",
  "Seahorse": "🌊",
  "Puffers": "🐡",
  "Clams": "🐚",
  "Corals": "🪸",
  "Eel": "🐍",
  "Nudibranchs": "🐛",
  "Sea Rays": "🐟",
  "Sea Urchins": "🔴",
};

const SUPPORTED: SpeciesType[] =[
  "Clams",
  "Corals",
  "Crabs",
  "Dolphin",
  "Eel",
  "Fish",
  "Jelly Fish",
  "Lobster",
  "Nudibranchs",
  "Octopus",
  "Otter",
  "Penguin",
  "Puffers",
  "Sea Rays",
  "Sea Urchins",
  "Seahorse",
  "Seal",
  "Sharks",
  "Shrimp",
  "Squid",
  "Starfish",
  "Turtle_Tortoise",
  "Whale",
];


const MarineClassifier: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpecies, setShowSpecies] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL: string = 'http://localhost:8000';

  const resetAll = useCallback((): void => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setConfidence(null);
    setError(null);
    setShowResults(false);
    setLoading(false);
  }, []);

  const handleFileSelect = useCallback((file: File): void => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setPrediction(null);
      setShowResults(false);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreview(result);
          classifyImage(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  }, []);

  const classifyImage = async (file: File): Promise<void> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data: PredictionResponse = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
        setConfidence(data.confidence || null);
        setShowResults(true);
      } else {
        setError(data.error || 'Prediction failed. Please try again.');
        setShowResults(true);
      }
    } catch (err) {
      setError('Network error. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const formatSpeciesName = (name: string | null): string => {
    return name?.replace(/_/g, "/") || "";
  }

  const getSpeciesEmoji = (species: string): string => {
    return EMOJI[species as SpeciesType] || "🌊";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 flex flex-col">

      <header className="flex-shrink-0 px-6 pt-8 pb-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-3xl mb-4 backdrop-blur-sm">
            <Fish className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Seek Marine</h1>
          <p className="text-blue-100 text-sm">seek what's in the ocean's depth</p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-32 overflow-y-auto">
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl">
              <div className="aspect-square w-full">
                <img
                  src={preview}
                  alt="Captured marine life"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={resetAll}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  
  );
};

export default MarineClassifier;
