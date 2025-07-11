// src/components/AddPublicationPage.jsx
import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../services/publicationService';
import { usePublications } from '../hooks/usePublications';
import { useNavigate } from 'react-router-dom';
export default function AddPublicationPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [coverFile, setCoverFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const { addPublication, loading, error } = usePublications();
    const [tautan, setTautan] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!title || !releaseDate) {
            alert('Judul dan Tanggal Rilis harus diisi!');
            return;
        }
        let coverUrl = '';
        if (coverFile) {
            try {
                coverUrl = await uploadImageToCloudinary(coverFile);
            } catch (err) {
                alert('Gagal upload gambar: ');
                return;
            }
        } else {
            coverUrl =
                `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(title)}`
                ;
        }
        const newPublication = {
            title,
            releaseDate,
            description,
            coverUrl,
            tautan,
        };
        console.log('New Publication:', newPublication);
        try {
            await addPublication(newPublication);
            setTitle('');
            setReleaseDate('');
            setDescription('');
            setCoverFile(null);
        } catch (err) {
            alert('Gagal menambah publikasi: ' + err.message);
        }finally{
            if (error) return <div className="text-red-500">Error</div>;
            if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
            navigate('/publications');   
        }
    };


    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-15">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Tambah
                Publikasi Baru</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>

                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>

                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Contoh: Produk Domestik Regional Bruto Kabupaten/Kota Provinsi Sulawesi Tengah"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Contoh: Publikasi ini merupakan publikasi yang disusun untuk memberikan informasi spasial perekonomian dari sisi Pengeluaran."
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
                <div>
                    <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>
                    <input
                        type="file"
                        id="cover"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            setCoverFile(file);
                            setShowPreview(!!file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="tautan" className="block text-sm font-medium text-gray-700 mb-1">Tautan Publikasi</label>
                    <input
                        type="url"
                        id="tautan"
                        placeholder='https://example.com/publikasi'
                        onChange={e => {
                            const link = e.target.value;
                            setTautan(link);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className={`${showPreview == false ? 'hidden' : 'block'}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sampul Terpilih</label>
                    <img
                        src={coverFile ? URL.createObjectURL(coverFile) : 'https://placehold.co/100x140/cccccc/ffffff?text=No+Image'}
                        alt={`Sampul ${title}`}
                        className="h-40 w-auto object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-300"
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x140/cccccc/ffffff?text=No+Image';
                        }}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-sky-700 hover:bg-sky-900 hover:cursor-pointer text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                        Tambah
                    </button>
                </div>
            </form>
        </div>
    );
}