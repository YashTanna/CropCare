// import React, { useState, useRef } from "react";
// import UploadBox from "../components/UploadBox";
// import ChatPanel from "../components/ChatPanel";

// export default function PredictPage() {
//     const [imageData, setImageData] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [mode, setMode] = useState("upload");
//     const [loading, setLoading] = useState(false);
//     const [referenceImages, setReferenceImages] = useState([]);
//     const focusTriggerRef = useRef(0);

//     // ------------ file handling ------------
//     function handleUpload(file) {
//         setImageFile(file);
//         const reader = new FileReader();
//         reader.onload = (e) => setImageData(e.target.result);
//         reader.readAsDataURL(file);

//         setMode("preview");
//         setChatMessages([]);
//         setReferenceImages([]);
//     }

//     // ------------ label cleaner ------------
//     function formatDiseaseName(raw) {
//         if (!raw || typeof raw !== "string") return "";
//         let parts = raw.split(/_{2,}/);
//         if (parts.length === 1) {
//             const lastUnderscore = raw.lastIndexOf("_");
//             if (lastUnderscore > -1) {
//                 const before = raw.slice(0, lastUnderscore);
//                 const after = raw.slice(lastUnderscore + 1);
//                 parts = [before, after];
//             } else {
//                 parts = [raw];
//             }
//         }
//         const cleanedParts = parts.map(p => (p || "").replace(/_/g, " ").trim()).filter(Boolean);
//         return cleanedParts.join(" ").replace(/\s{2,}/g, " ").trim();
//     }

//     // ------------ helpers ------------
//     function getFallbackTreatment(diseaseName) {
//         return `No Wikipedia info found for "${diseaseName}". Suggested general steps: remove affected leaves, improve airflow, avoid overhead irrigation, use recommended fungicide for your region, and consult a local agronomist.`;
//     }

//     // --- Wikipedia helpers ---
//     async function fetchExtract(title) {
//         try {
//             const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exlimit=1&titles=${encodeURIComponent(
//                 title
//             )}&format=json&origin=*`;
//             const r = await fetch(url);
//             if (!r.ok) return null;
//             const j = await r.json();
//             const pages = j?.query?.pages;
//             if (!pages) return null;
//             const page = Object.values(pages)[0];
//             if (!page?.extract) return null;
//             return {
//                 title: page.title,
//                 extract: page.extract,
//                 url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
//             };
//         } catch {
//             return null;
//         }
//     }

//     async function fetchBySearch(query) {
//         try {
//             const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
//                 query
//             )}&srlimit=5&format=json&origin=*`;
//             const r = await fetch(searchUrl);
//             if (!r.ok) return null;
//             const j = await r.json();
//             const hits = j?.query?.search || [];
//             for (const hit of hits) {
//                 const candidateTitle = hit.title;
//                 const s = await fetchExtract(candidateTitle);
//                 if (s) return s;
//             }
//             return null;
//         } catch {
//             return null;
//         }
//     }

//     async function fetchMediaList(title, cropKeyword) {
//         try {
//             const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
//             const r = await fetch(url);
//             if (!r.ok) return [];
//             const j = await r.json();
//             if (!j || !j.items) return [];

//             const images = j.items.filter(it => it.type === "image" && it.srcset);

//             const preferred = images.filter(it =>
//                 (it.title && it.title.toLowerCase().includes(cropKeyword.toLowerCase())) ||
//                 (it.caption && it.caption.text && it.caption.text.toLowerCase().includes(cropKeyword.toLowerCase()))
//             );

//             const chosen = (preferred.length > 0 ? preferred : images).slice(0, 3);

//             return chosen.map(it => it.srcset?.[0]?.src).filter(Boolean);
//         } catch {
//             return [];
//         }
//     }

//     async function fetchMediaBySearch(query, cropKeyword) {
//         try {
//             const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
//                 query
//             )}&srlimit=5&format=json&origin=*`;
//             const r = await fetch(searchUrl);
//             if (!r.ok) return [];
//             const j = await r.json();
//             const hits = j?.query?.search || [];
//             for (const hit of hits) {
//                 const candidateTitle = hit.title;
//                 const imgs = await fetchMediaList(candidateTitle, cropKeyword);
//                 if (imgs.length > 0) return imgs;
//             }
//             return [];
//         } catch {
//             return [];
//         }
//     }

//     // ------------ fetch disease info (with full fallback) ------------
//     const fetchDiseaseInfo = async (diseaseName) => {
//         setLoading(true);
//         const userMsgText = `What is the solution for ${diseaseName}?`;
//         setChatMessages([{ role: "user", text: userMsgText }]);

//         try {
//             let data = await fetchExtract(diseaseName);
//             let diseaseOnly = null;

//             if (!data && diseaseName.includes(" ")) {
//                 const parts = diseaseName.split(" ");
//                 diseaseOnly = parts.slice(1).join(" ");
//                 data = await fetchExtract(diseaseOnly);
//             }

//             if (!data) {
//                 data = await fetchBySearch(diseaseName);
//             }

//             if (!data) {
//                 const fallbackMessage = getFallbackTreatment(diseaseName);
//                 setChatMessages([
//                     { role: "user", text: userMsgText },
//                     { role: "bot", text: fallbackMessage },
//                 ]);
//                 setReferenceImages([`/images/${diseaseName.replace(/\s+/g, "_")}/sample.jpg`]);
//                 return;
//             }

//             // Display text
//             setChatMessages([
//                 { role: "user", text: userMsgText },
//                 {
//                     role: "bot",
//                     text: (
//                         <div className="max-h-60 overflow-y-auto whitespace-pre-wrap">
//                             {data.extract}
//                             <div className="mt-2">
//                                 <a
//                                     href={data.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-emerald-600 underline"
//                                 >
//                                     Read more on Wikipedia
//                                 </a>
//                             </div>
//                         </div>
//                     )
//                 },
//             ]);

//             // --- IMAGES ---
//             const cropKeyword = diseaseName.split(" ")[0];
//             let imgs = await fetchMediaList(diseaseName, cropKeyword);

//             if (imgs.length === 0 && diseaseOnly) {
//                 imgs = await fetchMediaList(diseaseOnly, cropKeyword);
//             }

//             if (imgs.length === 0) {
//                 imgs = await fetchMediaBySearch(diseaseName, cropKeyword);
//             }

//             if (imgs.length === 0) {
//                 imgs = [`/images/${diseaseName.replace(/\s+/g, "_")}/sample.jpg`];
//             }

//             setReferenceImages(imgs);

//         } catch (error) {
//             console.error("Error fetching disease info:", error);
//             const fallbackMessage = getFallbackTreatment(diseaseName);
//             setChatMessages([
//                 { role: "user", text: userMsgText },
//                 { role: "bot", text: fallbackMessage },
//             ]);
//             setReferenceImages([`/images/${diseaseName.replace(/\s+/g, "_")}/sample.jpg`]);
//         } finally {
//             setLoading(false);
//             focusTriggerRef.current += 1;
//         }
//     };

//     // ------------ predict flow ------------
//     async function handlePredict() {
//         if (!imageFile) return alert("Select an image first.");
//         setLoading(true);

//         try {
//             const fd = new FormData();
//             fd.append("file", imageFile);

//             const res = await fetch("http://127.0.0.1:8000/predict?top_k=3", { method: "POST", body: fd });
//             if (!res.ok) throw new Error(`predict failed: ${res.status}`);
//             const json = await res.json();

//             console.log(json);

//             const label = json.predicted_class;
//             if (!label) throw new Error("No label from backend");

//             const cleanedLabel = formatDiseaseName(label);
//             await fetchDiseaseInfo(cleanedLabel);

//             setMode("chat");
//         } catch (err) {
//             console.error(err);
//             setChatMessages([{ role: "bot", text: "Prediction failed. Try again." }]);
//             setMode("chat");
//             focusTriggerRef.current += 1;
//             setReferenceImages([]);
//         } finally {
//             setLoading(false);
//         }
//     }

//     // ------------ clear ------------
//     function handleClear() {
//         setImageData(null);
//         setImageFile(null);
//         setChatMessages([]);
//         setReferenceImages([]);
//         setMode("upload");
//     }

//     // ------------ render ------------
//     return (
//         <div className="min-h-screen bg-white">
//             <div className="max-w-4xl mx-auto px-6 py-12">
//                 <h1 className="text-4xl text-center font-bold text-emerald-700 mb-3">Disease Prediction</h1>
//                 <p className="text-center text-emerald-500 mb-10">
//                     Upload an image of your plant to detect diseases
//                 </p>

//                 <div className="flex justify-center">
//                     <div className="w-full max-w-xl">
//                         {mode === "upload" && (
//                             <UploadBox
//                                 imageData={null}
//                                 onFileSelect={handleUpload}
//                                 onPredict={handlePredict}
//                                 onClear={handleClear}
//                                 loading={loading}
//                                 mode={mode}
//                             />
//                         )}

//                         {mode === "preview" && (
//                             <UploadBox
//                                 imageData={imageData}
//                                 onFileSelect={handleUpload}
//                                 onPredict={handlePredict}
//                                 onClear={handleClear}
//                                 loading={loading}
//                                 mode={mode}
//                             />
//                         )}

//                         {mode === "chat" && (
//                             <div>
//                                 <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//                                     <img
//                                         src={imageData}
//                                         alt="preview"
//                                         className="w-full max-h-96 object-contain rounded-md"
//                                     />
//                                     <button
//                                         onClick={handleClear}
//                                         className="mt-4 px-4 py-2 border rounded-md"
//                                     >
//                                         Clear
//                                     </button>
//                                 </div>

//                                 <div className="bg-white rounded-xl shadow-md p-6">
//                                     <ChatPanel
//                                         messages={chatMessages}
//                                         autoFocusTrigger={focusTriggerRef.current}
//                                     />

//                                     {referenceImages.length > 0 && (
//                                         <div className="mt-6">
//                                             <h4 className="font-semibold mb-2">Reference Images:</h4>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                 {referenceImages.map((img, idx) => (
//                                                     <img
//                                                         key={idx}
//                                                         src={img}
//                                                         alt={`Reference ${idx + 1}`}
//                                                         className="rounded-lg shadow-md max-h-64 object-contain"
//                                                         onError={(e) => { e.target.style.display = "none"; }}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useRef } from "react";
import UploadBox from "../components/UploadBox";
import ChatPanel from "../components/ChatPanel";

export default function PredictPage() {
    const [imageData, setImageData] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [mode, setMode] = useState("upload");
    const [loading, setLoading] = useState(false);
    const [referenceImages, setReferenceImages] = useState([]);
    const focusTriggerRef = useRef(0);

    // ------------ file handling ------------
    function handleUpload(file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImageData(e.target.result);
        reader.readAsDataURL(file);

        setMode("preview");
        setChatMessages([]);
        setReferenceImages([]);
    }

    // ------------ label cleaner (for display only) ------------
    function formatDiseaseName(raw) {
        if (!raw || typeof raw !== "string") return "";
        // split on two or more underscores to separate class parts
        let parts = raw.split(/_{2,}/);
        if (parts.length === 1) {
            const lastUnderscore = raw.lastIndexOf("_");
            if (lastUnderscore > -1) {
                const before = raw.slice(0, lastUnderscore);
                const after = raw.slice(lastUnderscore + 1);
                parts = [before, after];
            } else {
                parts = [raw];
            }
        }
        const cleanedParts = parts.map(p => (p || "").replace(/_/g, " ").trim()).filter(Boolean);
        return cleanedParts.join(" ").replace(/\s{2,}/g, " ").trim();
    }

    // ------------ helpers ------------
    function getFallbackTreatment(diseaseName) {
        return `No detailed info found for "${diseaseName}". Suggested general steps: remove affected leaves, improve airflow, avoid overhead irrigation, use recommended fungicide for your region, and consult a local agronomist.`;
    }

    // ------------ Wikipedia / Extracts helpers ------------
    async function fetchExtract(title) {
        if (!title) return null;
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exlimit=1&titles=${encodeURIComponent(
                title
            )}&format=json&origin=*`;
            const r = await fetch(url);
            if (!r.ok) return null;
            const j = await r.json();
            const pages = j?.query?.pages;
            if (!pages) return null;
            const page = Object.values(pages)[0];
            if (!page || page.missing || !page.extract) return null;
            return {
                title: page.title,
                extract: page.extract,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
            };
        } catch {
            return null;
        }
    }

    async function fetchBySearch(query) {
        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
                query
            )}&srlimit=5&format=json&origin=*`;
            const r = await fetch(searchUrl);
            if (!r.ok) return null;
            const j = await r.json();
            const hits = j?.query?.search || [];
            for (const hit of hits) {
                const candidateTitle = hit.title;
                const s = await fetchExtract(candidateTitle);
                if (s) return s;
            }
            return null;
        } catch {
            return null;
        }
    }

    // media-list helper (wiki)
    async function fetchMediaList(title, cropKeyword) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
            const r = await fetch(url);
            if (!r.ok) return [];
            const j = await r.json();
            if (!j || !j.items) return [];

            const images = j.items.filter(it => it.type === "image" && it.srcset);
            const preferred = images.filter(it =>
                (it.title && it.title.toLowerCase().includes(cropKeyword.toLowerCase())) ||
                (it.caption && it.caption.text && it.caption.text.toLowerCase().includes(cropKeyword.toLowerCase()))
            );

            const chosen = (preferred.length > 0 ? preferred : images).slice(0, 5);
            return chosen.map(it => it.srcset?.[0]?.src).filter(Boolean);
        } catch {
            return [];
        }
    }

    async function fetchMediaBySearch(query, cropKeyword) {
        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
                query
            )}&srlimit=5&format=json&origin=*`;
            const r = await fetch(searchUrl);
            if (!r.ok) return [];
            const j = await r.json();
            const hits = j?.query?.search || [];
            for (const hit of hits) {
                const candidateTitle = hit.title;
                const imgs = await fetchMediaList(candidateTitle, cropKeyword);
                if (imgs.length > 0) return imgs;
            }
            return [];
        } catch {
            return [];
        }
    }

    // ------------ load local dataset images (tries many extensions) ------------
    // Returns an array of likely URLs (some may 404; <img onError> hides them)
    function buildLocalImageCandidates(rawLabel, maxPerClass = 20) {
        if (!rawLabel) return [];
        const basePath = `/images/${rawLabel}`; // use RAW predicted_class folder (exact match)
        const exts = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".webp", ".WEBP"];
        const candidates = [];
        for (let i = 1; i <= maxPerClass; i++) {
            for (const ext of exts) {
                candidates.push(`${basePath}/${i}${ext}`);
            }
        }
        return candidates;
    }

    // ------------ main fetch flow (full extract + image fallback) ------------
    // const fetchDiseaseInfo = async (rawLabel) => {
    //     // rawLabel is exactly json.predicted_class from backend (e.g. "Peach___Bacterial_spot")
    //     setLoading(true);
    //     const cleanedLabel = formatDiseaseName(rawLabel); // used in chat/user text
    //     const userMsgText = `What is the solution for ${cleanedLabel}?`;
    //     setChatMessages([{ role: "user", text: userMsgText }]);

    //     try {
    //         // 1) Try full extract with raw cleaned name first (cleanedLabel has spaces)
    //         let data = await fetchExtract(cleanedLabel);

    //         // 2) If not found, try disease-only (strip crop)
    //         let diseaseOnly = null;
    //         if (!data && cleanedLabel.includes(" ")) {
    //             const parts = cleanedLabel.split(" ");
    //             diseaseOnly = parts.slice(1).join(" ");
    //             data = await fetchExtract(diseaseOnly);
    //         }

    //         // 3) If still not found, do a search to resolve title
    //         if (!data) {
    //             data = await fetchBySearch(cleanedLabel);
    //         }

    //         // Message content (either extract or fallback)
    //         if (data) {
    //             // full article extract (long)
    //             setChatMessages([
    //                 { role: "user", text: userMsgText },
    //                 {
    //                     role: "bot",
    //                     text: (
    //                         <div className="max-h-72 overflow-y-auto whitespace-pre-wrap">
    //                             {data.extract}
    //                             <div className="mt-2">
    //                                 <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
    //                                     Read more on Wikipedia
    //                                 </a>
    //                             </div>
    //                         </div>
    //                     )
    //                 }
    //             ]);
    //         } else {
    //             setChatMessages([
    //                 { role: "user", text: userMsgText },
    //                 { role: "bot", text: getFallbackTreatment(cleanedLabel) }
    //             ]);
    //         }

    //         // ---------------- IMAGES: try local dataset first (preferred) ----------------
    //         // Use the rawLabel for folder path (must match your folder names in public/images)
    //         const localCandidates = buildLocalImageCandidates(rawLabel, 20);

    //         // Set the candidates (they may 404; onError will hide them). We show them first.
    //         // BUT to keep UI tidy, only add distinct URLs and limit to e.g. first 12 to avoid huge load.
    //         const distinctLocal = Array.from(new Set(localCandidates)).slice(0, 12);

    //         // Optionally we can try to detect if at least one local image exists by doing HEAD requests,
    //         // but browsers don't allow cross-origin HEAD to filesystem; instead rely on <img onError>.
    //         // We'll show local candidates first. If none actually load, we'll then try Wikipedia images.
    //         setReferenceImages(distinctLocal);

    //         // After setting locals, also attempt to fetch wiki images as additional sources (append them)
    //         // but only if we couldn't find any local images visually — since we can't detect 404 without fetching,
    //         // we append wiki images as second group.
    //         const cropKeyword = cleanedLabel.split(" ")[0] || "";
    //         let wikiImgs = await fetchMediaList(cleanedLabel, cropKeyword);
    //         if (wikiImgs.length === 0 && diseaseOnly) wikiImgs = await fetchMediaList(diseaseOnly, cropKeyword);
    //         if (wikiImgs.length === 0) wikiImgs = await fetchMediaBySearch(cleanedLabel, cropKeyword);

    //         // Append wiki images after local candidates, avoid duplicates
    //         if (wikiImgs.length > 0) {
    //             setReferenceImages(prev => {
    //                 const all = [...prev, ...wikiImgs];
    //                 return Array.from(new Set(all)).slice(0, 12);
    //             });
    //         }

    //     } catch (err) {
    //         console.error("fetchDiseaseInfo error:", err);
    //         setChatMessages([{ role: "user", text: userMsgText }, { role: "bot", text: getFallbackTreatment(formatDiseaseName(rawLabel)) }]);
    //         // fallback to local path single sample
    //         setReferenceImages([`/images/${rawLabel}/1.jpg`, `/images/${rawLabel}/1.JPG`]);
    //     } finally {
    //         setLoading(false);
    //         // trigger chat container scroll/focus in ChatPanel (you already handle autoFocusTrigger)
    //         focusTriggerRef.current += 1;
    //     }
    // };

    const fetchDiseaseInfo = async (rawLabel) => {
        // rawLabel is exactly json.predicted_class from backend (e.g. "Peach___Bacterial_spot")
        setLoading(true);
        const cleanedLabel = formatDiseaseName(rawLabel); // used in chat/user text
        const userMsgText = `What is the solution for ${cleanedLabel}?`;
        setChatMessages([{ role: "user", text: userMsgText }]);

        try {
            // 1) Try full extract with raw cleaned name first
            let data = await fetchExtract(cleanedLabel);

            // 2) If not found, try disease-only (strip crop)
            let diseaseOnly = null;
            if (!data && cleanedLabel.includes(" ")) {
                const parts = cleanedLabel.split(" ");
                diseaseOnly = parts.slice(1).join(" ");
                data = await fetchExtract(diseaseOnly);
            }

            // 3) If still not found, do a search to resolve title
            if (!data) {
                data = await fetchBySearch(cleanedLabel);
            }

            // Message content (either extract or fallback)
            if (data) {
                setChatMessages([
                    { role: "user", text: userMsgText },
                    {
                        role: "bot",
                        text: (
                            <div className="max-h-72 overflow-y-auto whitespace-pre-wrap">
                                {data.extract}
                                <div className="mt-2">
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 underline"
                                    >
                                        Read more on Wikipedia
                                    </a>
                                </div>
                            </div>
                        )
                    }
                ]);
            } else {
                setChatMessages([
                    { role: "user", text: userMsgText },
                    { role: "bot", text: getFallbackTreatment(cleanedLabel) }
                ]);
            }

            // ---------------- IMAGES: use local dataset (exactly 5 JPGs per class) ----------------
            const imgs = [];
            for (let i = 1; i <= 6; i++) {
                imgs.push(`/images/${rawLabel}/${i}.jpg`);
            }
            setReferenceImages(imgs);

        } catch (err) {
            console.error("fetchDiseaseInfo error:", err);
            setChatMessages([
                { role: "user", text: userMsgText },
                { role: "bot", text: getFallbackTreatment(formatDiseaseName(rawLabel)) }
            ]);
            setReferenceImages([`/images/${rawLabel}/1.JPG`]); // fallback to first image
        } finally {
            setLoading(false);
            focusTriggerRef.current += 1;
        }
    };


    // ------------ predict flow ------------
    async function handlePredict() {
        if (!imageFile) return alert("Select an image first.");
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("file", imageFile);

            const res = await fetch("http://127.0.0.1:8000/predict?top_k=3", { method: "POST", body: fd });
            if (!res.ok) throw new Error(`predict failed: ${res.status}`);
            const json = await res.json();

            console.log("predict output:", json);

            const rawLabel = json.predicted_class;
            if (!rawLabel) throw new Error("No label from backend");

            // fetchDiseaseInfo now accepts rawLabel so it can use raw folder names for images
            await fetchDiseaseInfo(rawLabel);

            setMode("chat");
        } catch (err) {
            console.error(err);
            setChatMessages([{ role: "bot", text: "Prediction failed. Try again." }]);
            setMode("chat");
            focusTriggerRef.current += 1;
            setReferenceImages([]);
        } finally {
            setLoading(false);
        }
    }

    // ------------ clear ------------
    function handleClear() {
        setImageData(null);
        setImageFile(null);
        setChatMessages([]);
        setReferenceImages([]);
        setMode("upload");
    }

    // ------------ render ------------
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl text-center font-bold text-emerald-700 mb-3">Disease Prediction</h1>
                <p className="text-center text-emerald-500 mb-10">Upload an image of your plant to detect diseases</p>

                <div className="flex justify-center">
                    <div className="w-full max-w-xl">
                        {mode === "upload" && (
                            <UploadBox
                                imageData={null}
                                onFileSelect={handleUpload}
                                onPredict={handlePredict}
                                onClear={handleClear}
                                loading={loading}
                                mode={mode}
                            />
                        )}

                        {mode === "preview" && (
                            <UploadBox
                                imageData={imageData}
                                onFileSelect={handleUpload}
                                onPredict={handlePredict}
                                onClear={handleClear}
                                loading={loading}
                                mode={mode}
                            />
                        )}

                        {mode === "chat" && (
                            <div>
                                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                    <img src={imageData} alt="preview" className="w-full max-h-96 object-contain rounded-md" />
                                    <button onClick={handleClear} className="mt-4 px-4 py-2 border rounded-md">Clear</button>
                                </div>

                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <ChatPanel messages={chatMessages} autoFocusTrigger={focusTriggerRef.current} />

                                    {referenceImages.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="font-semibold mb-2">Reference Images:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {referenceImages.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`Reference ${idx + 1}`}
                                                        className="rounded-lg shadow-md max-h-64 object-contain"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
