const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        const fetchMessage = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/user", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setMessage(res.data.msg);
            } catch (err) {
                console.error(err.response?.data?.msg || "Error fetching dashboard data");
            }
        };

        if (user?.token) {
            fetchMessage();
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-4">Dashboard</h1>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-xl mb-4">{message || "Loading..."}</p>

                    <div>
                        {user?.role === "admin" ? (
                            <div className="bg-blue-100 p-4 rounded-md">
                                <h2 className="text-2xl font-semibold">Admin Content</h2>
                                <p>Special admin access granted here.</p>
                            </div>
                        ) : (
                            <div className="bg-green-100 p-4 rounded-md">
                                <h2 className="text-2xl font-semibold">User Content</h2>
                                <p>Access granted for regular users.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
