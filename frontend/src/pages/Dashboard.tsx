import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoCard from '../components/dashboard/UserInfoCard';
import BalanceCard from '../components/dashboard/BalanceCard';
import ChartsSection from '../components/dashboard/ChartsSection';
import LogoutButton from '../components/auth/LogoutButton';
import LoadBalanceModal from '../components/dashboard/LoadBalanceModal';
import SnailSelection from '../components/dashboard/SnailSelection';
import RaceResult from '../components/dashboard/RaceResult';
import { useAuth } from '../hooks/useAuth';
import { sessionStorage } from '../data/localStorage';

type DashboardStep = 'selection' | 'result';

interface RaceHistory {
    id: number;
    selectedSnailId: number;
    winnerSnailId: number;
    timestamp: number;
}

const Dashboard = () => {
    const { user, logout, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<DashboardStep>('selection');
    const [selectedSnail, setSelectedSnail] = useState<{
        id: number;
        name: string;
        color: string;
    } | null>(null);
    const [winnerSnail, setWinnerSnail] = useState<{
        id: number;
        name: string;
        color: string;
    } | null>(null);
    const [racesHistory, setRacesHistory] = useState<RaceHistory[]>([]);
    const [todayRaceCount, setTodayRaceCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const DAILY_RACE_LIMIT = 6;
    const BET_AMOUNT = 10;

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            setBalance(sessionStorage.getBalance());
            setRacesHistory(sessionStorage.getRacesHistory<RaceHistory>());
            setTodayRaceCount(sessionStorage.getTodayRaceCount());
        }
    }, [isAuthenticated]);

    // Datos de caracoles
    const snails = useMemo(
        () => [
            { id: 1, name: 'Speedy', color: '#FF6B6B' },
            { id: 2, name: 'Turbo', color: '#4ECDC4' },
            { id: 3, name: 'Flash', color: '#45B7D1' },
            { id: 4, name: 'Bolt', color: '#96CEB4' },
            { id: 5, name: 'Zoom', color: '#FFEAA7' },
            { id: 6, name: 'Dash', color: '#DDA0DD' },
        ],
        []
    );

    // Calcular datos reales basados en historial de carreras
    const snailData = useMemo(() => {
        const wins = new Array(6).fill(0);

        racesHistory.forEach((race) => {
            const winnerIndex = race.winnerSnailId - 1;
            if (winnerIndex >= 0 && winnerIndex < 6) {
                wins[winnerIndex]++;
            }
        });

        return snails.map((snail, index) => ({
            name: snail.name,
            wins: wins[index],
            color: snail.color,
        }));
    }, [snails, racesHistory]);

    const bettingData = useMemo(() => {
        let won = 0;
        let lost = 0;

        racesHistory.forEach((race) => {
            if (race.selectedSnailId === race.winnerSnailId) {
                won++;
            } else {
                lost++;
            }
        });

        return { won, lost };
    }, [racesHistory]);

    const handleLoadBalance = () => {
        setIsModalOpen(true);
    };

    const handleLoadBalanceSuccess = () => {
        setBalance(sessionStorage.getBalance());
        setTodayRaceCount(sessionStorage.getTodayRaceCount());
    };

    const handleResetDailyCount = () => {
        sessionStorage.resetDailyRaceCount();
        setTodayRaceCount(0);
    };

    const handleSnailSelect = (snailId: number) => {
        setError(null);

        if (balance < BET_AMOUNT) {
            setError(`Necesitas al menos $${BET_AMOUNT} para apostar. Recarga tu balance.`);
            return;
        }

        if (todayRaceCount >= DAILY_RACE_LIMIT) {
            setError(
                `Has alcanzado el límite de ${DAILY_RACE_LIMIT} carreras por día. Vuelve mañana.`
            );
            return;
        }

        const snail = snails.find((s) => s.id === snailId);
        if (snail) {
            setSelectedSnail(snail);

            // Simular carrera y elegir ganador aleatorio
            const winner = snails[Math.floor(Math.random() * snails.length)];
            setWinnerSnail(winner);

            // Actualizar balance según resultado
            const won = snail.id === winner.id;
            if (won) {
                const newBalance = balance + BET_AMOUNT;
                sessionStorage.setBalance(newBalance);
                setBalance(newBalance);
            } else {
                const newBalance = balance - BET_AMOUNT;
                sessionStorage.setBalance(newBalance);
                setBalance(newBalance);
            }

            // Guardar carrera en historial
            const newRace: RaceHistory = {
                id: Date.now(),
                selectedSnailId: snail.id,
                winnerSnailId: winner.id,
                timestamp: Date.now(),
            };
            sessionStorage.addRace(newRace);
            setRacesHistory((prev) => [...prev, newRace]);

            // Incrementar contador diario
            const newCount = sessionStorage.incrementDailyRaceCount();
            setTodayRaceCount(newCount);

            setCurrentStep('result');
        }
    };

    const handleNewRace = () => {
        setSelectedSnail(null);
        setWinnerSnail(null);
        setError(null);
        setCurrentStep('selection');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">SnailPlay Betting</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{user.name}</span>
                            <LogoutButton onLogout={logout} />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UserInfoCard name={user.name} email={user.email} />
                    <BalanceCard
                        balance={balance}
                        onLoadBalance={handleLoadBalance}
                        racesRemaining={DAILY_RACE_LIMIT - todayRaceCount}
                        onResetDailyCount={handleResetDailyCount}
                    />

                    {currentStep === 'selection' && (
                        <SnailSelection
                            snails={snails}
                            onSelect={handleSnailSelect}
                            error={error}
                        />
                    )}

                    {currentStep === 'result' && selectedSnail && winnerSnail && (
                        <RaceResult
                            selectedSnail={selectedSnail}
                            winnerSnail={winnerSnail}
                            onContinue={handleNewRace}
                        />
                    )}

                    <ChartsSection bettingData={bettingData} snailData={snailData} />
                </div>
            </main>

            <LoadBalanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleLoadBalanceSuccess}
            />
        </div>
    );
};

export default Dashboard;
