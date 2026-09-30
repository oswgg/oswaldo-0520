import Card from '../common/Card';
import Button from '../common/Button';

interface Snail {
    id: number;
    name: string;
    color: string;
}

interface RaceResultProps {
    selectedSnail: Snail;
    winnerSnail: Snail;
    onContinue: () => void;
}

const RaceResult = ({ selectedSnail, winnerSnail, onContinue }: RaceResultProps) => {
    const won = selectedSnail.id === winnerSnail.id;

    return (
        <Card className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Resultado de la Carrera</h2>
            <div className="text-center py-8">
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Ganador de la carrera:</p>
                    <div
                        className="inline-block w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto"
                        style={{ backgroundColor: winnerSnail.color }}
                    >
                        🐌
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: winnerSnail.color }}>
                        {winnerSnail.name}
                    </p>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Tu apuesta:</p>
                    <div
                        className="inline-block w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto"
                        style={{ backgroundColor: selectedSnail.color }}
                    >
                        🐌
                    </div>
                    <p className="text-xl font-medium mt-2" style={{ color: selectedSnail.color }}>
                        {selectedSnail.name}
                    </p>
                </div>

                <div
                    className={`p-4 rounded-lg mb-6 ${
                        won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    <p className="text-2xl font-bold">{won ? '¡Ganaste! 🎉' : 'Perdiste 😢'}</p>
                    <p className="text-sm mt-1">
                        {won ? 'Tu caracol ganó la carrera' : 'Tu caracol no ganó esta vez'}
                    </p>
                </div>

                <Button onClick={onContinue} className="w-full max-w-xs mx-auto">
                    Nueva Carrera
                </Button>
            </div>
        </Card>
    );
};

export default RaceResult;
