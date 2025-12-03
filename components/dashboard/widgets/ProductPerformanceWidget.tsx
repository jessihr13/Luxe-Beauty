'use client';

interface ProductPerformanceWidgetProps {
    products: any[];
}

export default function ProductPerformanceWidget({ products }: ProductPerformanceWidgetProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4">Producto</th>
                        <th className="text-right py-3 px-4">Precio</th>
                        <th className="text-right py-3 px-4">Costo</th>
                        <th className="text-right py-3 px-4">Margen</th>
                        <th className="text-right py-3 px-4">Vendidos</th>
                        <th className="text-right py-3 px-4">Ganancia</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => {
                        const margin = product.price - (product.cost || 0);
                        const marginPercent = (margin / product.price) * 100;
                        const sold = product.neuromarketing.socialProof.purchaseCount;
                        const profit = margin * sold;

                        return (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">{product.name}</td>
                                <td className="text-right py-3 px-4">${product.price.toFixed(2)}</td>
                                <td className="text-right py-3 px-4">${(product.cost || 0).toFixed(2)}</td>
                                <td className="text-right py-3 px-4">
                                    <span className={marginPercent > 50 ? 'text-green-600' : marginPercent > 30 ? 'text-yellow-600' : 'text-red-600'}>
                                        {marginPercent.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="text-right py-3 px-4">{sold}</td>
                                <td className="text-right py-3 px-4 font-semibold text-green-600">
                                    ${profit.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
