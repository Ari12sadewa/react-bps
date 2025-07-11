import React, { useState, useEffect } from 'react';
import { uploadImageToCloudinary } from '../services/publicationService';
import { usePublications } from '../hooks/usePublications';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPublicationPage() {
    const { id } = useParams(); // Ambil ID dari URL
    const { publications, editPublication, loading, error } = usePublications();
    const navigate = useNavigate();

    const selected = publications.find(p => p.id.toString() === id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [currentCover, setCurrentCover] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);

    useEffect(() => {
        if (selected) {
            setTitle(selected.title);
            setDescription(selected.description);
            setReleaseDate(selected.releaseDate.slice(0, 10));
            setCurrentCover(selected.coverUrl);
        }
    }, [selected]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !releaseDate) {
            alert('Judul dan Tanggal Rilis harus diisi!');
            return;
        }
    
        let coverFile; // Declare the variable here
    
        if (coverUrl) {
            try {
                coverFile = await uploadImageToCloudinary(coverUrl); // Assign the value
            } catch (err) {
                alert('Gagal upload gambar: ' + err.message);
                return;
            }
        }
    
        const updatedPub = {
            id: selected.id,
            title,
            releaseDate,
            description,
            coverUrl: coverFile || currentCover, // Use the uploaded file or the current cover
        };
    
        try {
            await editPublication(updatedPub);
            navigate('/publications');
        } catch (err) {
            alert('Gagal mengedit publikasi: ' + err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        rows={4}
                    />
                </div>
                <div>
                    <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
                    <input
                        type="date"
                        id="releaseDate"
                        value={releaseDate}
                        onChange={e => setReleaseDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Pilih Sampul</label>
                    <input
                        type="file"
                        id="cover"
                        accept="image/*"
                        onChange={e => {setCoverUrl(e.target.files[0])
                            setCurrentCover(URL.createObjectURL(e.target.files[0]));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sampul saat ini</label>
                    <img
                        src={currentCover}
                        alt={`Sampul ${title}`}
                        className="h-40 w-auto object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-300"
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x140/cccccc/ffffff?text=No+Image';
                        }}
                    />
                </div>
                <div className="flex gap-5 justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/publications')}
                        className="bg-gray-400 cursor-pointer hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="bg-sky-600 cursor-pointer hover:bg-sky-900 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}
