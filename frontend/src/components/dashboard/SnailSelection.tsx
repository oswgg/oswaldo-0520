import Card from '../common/Card';

interface Snail {
    id: number;
    name: string;
    color: string;
}

interface SnailSelectionProps {
    snails: Snail[];
    onSelect: (snailId: number) => void;
    error?: string | null;
}

const SnailSelection = ({ snails, onSelect, error }: SnailSelectionProps) => {
    return (
        <Card className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Elige tu caracol para apostar</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {snails.map((snail) => (
                    <button
                        key={snail.id}
                        onClick={() => onSelect(snail.id)}
                        className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors flex flex-col items-center gap-2 bg-white hover:bg-gray-50"
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                            style={{ backgroundColor: snail.color }}
                        >
                            🐌
                        </div>
                        <span className="font-medium text-gray-900">{snail.name}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default SnailSelection;
