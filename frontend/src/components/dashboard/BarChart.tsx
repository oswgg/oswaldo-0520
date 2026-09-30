import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface BarChartProps {
    data: Array<{
        name: string;
        wins: number;
        color?: string;
    }>;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

const BarChartComponent = ({ data }: BarChartProps) => {
    if (data.length === 0) {
        return (
            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-sm text-gray-400">No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" name="Wins">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
