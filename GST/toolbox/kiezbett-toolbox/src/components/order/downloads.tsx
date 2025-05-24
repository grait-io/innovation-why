import { Download } from 'lucide-react';

export const Downloads: React.FC<{ orderId: string }> = ({ orderId }) => {
    // Download-Funktion innerhalb der Komponente
    const handleDownload = (type: string) => {
        console.log(`Downloading ${type} for order ${orderId}`);
        // Hier füge die tatsächliche Download-Logik hinzu, z. B. API-Aufrufe
    };

    return (
        <div className="mt-8">
            <h3 className="text-base font-bold mt-8 mb-4">Downloads</h3>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-800 text-white font-light">
                        <tr>
                            <th className="px-4 py-2">Document</th>
                            <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-100">
                            <td className="border px-4 py-2">Download 1</td>
                            <td className="border px-2 py-2 text-right w-[40px]">
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={() => handleDownload('download 2')}
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-100">
                            <td className="border px-4 py-2">Download 2</td>
                            <td className="border px-2 py-2 text-right w-[40px]">
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={() => handleDownload('download 1')}
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
