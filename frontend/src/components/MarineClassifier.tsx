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
  Image
} from "lucide-react";

interface PredictionResponse {
  prediction: string;
  confidence?: number;
  error?: string;
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

const SUPPORTED: SpeciesType[] = [
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
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpecies, setShowSpecies] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE as string;

  const resetAll = useCallback((): void => {
    setPreview(null);
    setPrediction(null);
    setError(null);
    setShowResults(false);
    setLoading(false);
  }, []);

  const handleFileSelect = useCallback((file: File): void => {
    if (file && file.type.startsWith('image/')) {
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
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="relative w-[384px] max-w-[384px] h-[860px] bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 flex flex-col">
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
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                      <p className="text-gray-900 font-medium">Classifying...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Supported Species Section */}
          <div className="rounded-3xl backdrop-blur-md mb-6 overflow-hidden border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
            >
            <button
              onClick={() => setShowSpecies(!showSpecies)}
              className="w-full p-6 flex items-center justify-between text-white hover:bg-white/5 rounded-3xl transition-colors focus:outline-none focus:ring-0 border-0"
              style={{ 
                backgroundColor: 'transparent',
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-expanded={showSpecies}
              aria-controls="species-list"
            >
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-cyan-200" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Supported Species</h3>
                  <p className="text-blue-100 text-sm">{SUPPORTED.length} marine species</p>
                </div>
              </div>

              <ChevronDown
                className={'w-5 h-5 text-white transition-transform ' + (showSpecies ? 'rotate-180' : '')}
              />
            </button>

            <AnimatePresence>
              {showSpecies && (
                <motion.div
                  id="species-list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {SUPPORTED.map((species: SpeciesType) => (
                      <div
                        key={species}
                        className="flex items-center gap-3 bg-white/20 rounded-2xl p-4 backdrop-blur-sm"
                      >
                        <span className="text-2xl" aria-hidden="true">
                          {EMOJI[species]}
                        </span>
                        <span className="text-white font-medium text-sm">
                          {formatSpeciesName(species)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instructions */}
          {!preview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white/80 space-y-2"
            >
            </motion.div>
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200">
          <div className="px-6 py-4 pb-8">
            <div className="flex items-center justify-center gap-4">
              {/* GALLERY */}
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl active:scale-95 transition-transform"
                aria-label="Select from gallery"
              >
                <Image className="w-6 h-6 text-gray-700" />
                <span className="text-xs font-medium text-gray-700">Gallery</span>
              </button>

              {/* Camera Button */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2 px-8 py-4 bg-blue-600 rounded-3xl text-white shadow-lg active:scale-95 transition-transform"
                aria-label="Capture from camera"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm font-semibold">Camera</span>
              </button>

              {preview && (
                <button
                  onClick={resetAll}
                  className="flex flex-col items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl active:scale-95 transition-transform"
                  aria-label="Reset and take new photo"
                >
                  <RefreshCw className="w-6 h-6 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">Reset</span>
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraInput}
          className="hidden"
          aria-hidden="true"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleCameraInput}
          className="hidden"
          aria-hidden="true"
        />

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
              onClick={() => setShowResults(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="results-title"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-white rounded-t-3xl p-6"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
                {error ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 id="results-title" className="text-xl font-bold text-gray-900 mb-2">
                      Error
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                      onClick={() => setShowResults(false)}
                      className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : prediction ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl" aria-hidden="true">
                        {getSpeciesEmoji(prediction)}
                      </span>
                    </div>
                    <h3 id="results-title" className="text-2xl font-bold text-gray-900 mb-2">
                      {formatSpeciesName(prediction)}
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowResults(false)}
                        className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold"
                      >
                        Continue
                      </button>

                      <button
                        onClick={resetAll}
                        className="-full bg-gray-100 text-gray-900 py-3 rounded-2xl font-semibold"
                      >
                        Take Another Photo
                      </button>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MarineClassifier;
