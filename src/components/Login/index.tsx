function Login() {
    const { user } = useUser({ redirectTo: '/login' })

    // Server-render loading state
    if (!user || user.isLoggedIn === false) {
        return <div>Loading...</div>
    }

    return (
    );
}

export { Login };
