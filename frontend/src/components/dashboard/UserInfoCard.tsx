import Card from '../common/Card';

interface UserInfoCardProps {
    name: string;
    email: string;
}

const UserInfoCard = ({ name, email }: UserInfoCardProps) => {
    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
                <p>
                    <span className="font-medium">Name:</span> {name}
                </p>
                <p>
                    <span className="font-medium">Email:</span> {email}
                </p>
            </div>
        </Card>
    );
};

export default UserInfoCard;
