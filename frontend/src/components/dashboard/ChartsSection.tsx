import Card from '../common/Card';
import DonutChart from './DonutChart';
import BarChart from './BarChart';

interface ChartsSectionProps {
    // TODO: Definir tipos para datos de gráficas cuando estén disponibles del API
    bettingData?: {
        won: number;
        lost: number;
    };
    snailData?: Array<{
        name: string;
        wins: number;
    }>;
}

const ChartsSection = ({
    bettingData = { won: 0, lost: 0 },
    snailData = [],
}: ChartsSectionProps) => {
    return (
        <Card className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Betting Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DonutChart data={bettingData} />
                <BarChart data={snailData} />
            </div>
        </Card>
    );
};

export default ChartsSection;
