import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
    data: {
        won: number;
        lost: number;
    };
}

const COLORS = ['#10B981', '#EF4444'];

const DonutChartComponent = ({ data }: DonutChartProps) => {
    const chartData = [
        { name: 'Won', value: data.won },
        { name: 'Lost', value: data.lost },
    ];

    const total = data.won + data.lost;

    if (total === 0) {
        return (
            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-sm text-gray-400">No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={256}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChartComponent;
