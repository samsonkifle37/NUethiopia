"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save, MapPin, Tag, Info, Image as ImageIcon, Loader2, Camera, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NewPropertyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        propertyName: "",
        listingType: "Hotel",
        description: "",
        city: "Addis Ababa",
        fullAddress: "",
        contactPhone: "",
        priceRange: "",
        currency: "ETB"
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleCameraCapture = () => {
        // Trigger file input with capture="environment" for mobile camera access
        const cameraInput = fileInputRef.current;
        if (cameraInput) {
            cameraInput.setAttribute("capture", "environment");
            cameraInput.click();
            // Reset after a short delay so normal selection works next time
            setTimeout(() => cameraInput.removeAttribute("capture"), 1000);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages([...images, ...newFiles]);
            
            const newPreviews = newFiles.map(f => URL.createObjectURL(f));
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = [...images];
        const updatedPreviews = [...previews];
        
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);
        
        setImages(updatedImages);
        setPreviews(updatedPreviews);
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            // Note: In real prod, we'd upload images to S3/Cloudinary first
            // Here we send the text data to the draft API and handle 404 retry
            const res = await fetch("/api/host-listings/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                router.push("/profile/host");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save draft."}`);
            }
        } catch (err) {
            console.error("Draft Save Failed:", err);
            alert("Connection error. Check if server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-20">
            {/* Hidden Input for Files */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileChange} 
                multiple 
                accept="image/*" 
                className="hidden" 
            />

            <header className="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Logo className="w-6 h-6" />
                        <span className="font-bold text-gray-400">/</span>
                        <span className="font-black tracking-tight text-gray-900">New Listing</span>
                    </div>
                </div>
                <button 
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className={`${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2`}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft
                </button>
            </header>

            <main className="max-w-3xl mx-auto pt-10 px-4">
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                    ))}
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
                    
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Info className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-black text-[#1A1612]">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Property Name</label>
                                    <input 
                                       type="text" name="propertyName" value={formData.propertyName} onChange={handleChange}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Skyline Resthouse" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Listing Type</label>
                                    <select 
                                       name="listingType" value={formData.listingType} onChange={handleChange}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37] appearance-none"
                                    >
                                        <option value="Hotel">Hotel</option>
                                        <option value="Apartment">Apartment / Airbnb</option>
                                        <option value="Guesthouse">Guesthouse</option>
                                        <option value="Resort">Resort</option>
                                        <option value="Villa">Villa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea 
                                       name="description" value={formData.description} onChange={handleChange} rows={5}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37] resize-none" placeholder="Describe the vibe, target audience, and best features..." 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-black text-[#1A1612]">Location & Contact</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City / Area</label>
                                    <input 
                                       type="text" name="city" value={formData.city} onChange={handleChange}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Bole, Addis Ababa" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address (Visible to Guests)</label>
                                    <input 
                                       type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Cameroon Street, next to Edna Mall" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Booking Phone Number</label>
                                    <input 
                                       type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37]" placeholder="+251 9..." 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-[#1A1612]">Pricing Structure</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Average Price Range</label>
                                    <div className="flex gap-2">
                                        <select 
                                        name="currency" value={formData.currency} onChange={handleChange}
                                        className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#D4AF37] appearance-none"
                                        >
                                            <option value="ETB">ETB</option>
                                            <option value="USD">USD</option>
                                        </select>
                                        <input 
                                        type="text" name="priceRange" value={formData.priceRange} onChange={handleChange}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. 1500 - 3000 per night" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Leave generic if you have multiple room tiers. You can define exact pricing later.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-black text-[#1A1612]">Media & Submission</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button 
                                    onClick={handleFileSelect}
                                    className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#D4AF37] transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/10 transition-colors">
                                        <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37]" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Select Files</span>
                                    <span className="text-[10px] font-bold text-gray-400">JPG, PNG (Max 5MB)</span>
                                </button>

                                <button 
                                    onClick={handleCameraCapture}
                                    className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#D4AF37] transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/10 transition-colors">
                                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37]" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Take Photo</span>
                                    <span className="text-[10px] font-bold text-gray-400">Direct Camera Upload</span>
                                </button>
                            </div>

                            {/* Images Grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mb-8">
                                    {previews.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt="Listing" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-[#1A1612] p-5 rounded-2xl text-white">
                                <h4 className="font-bold text-[#D4AF37] text-sm mb-1">What happens next?</h4>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">Your listing will be saved as a draft. You can manage it from your owner dashboard and submit it for moderation when ready.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between items-center bg-white sticky bottom-0">
                        {step > 1 ? (
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                            >
                                Back
                            </button>
                        ) : <div></div>}

                        {step < 4 ? (
                            <button 
                                onClick={() => setStep(step + 1)}
                                className="bg-[#1A1612] text-[#D4AF37] px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                            >
                                Continue
                            </button>
                        ) : (
                            <button 
                                onClick={handleSaveDraft}
                                disabled={loading || formData.propertyName === ""}
                                className={`${loading || formData.propertyName === "" ? 'bg-gray-300 shadow-none' : 'bg-[#D4AF37] hover:bg-[#C9973B] shadow-[#D4AF37]/20'} text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2`}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Finalize Draft
                            </button>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
