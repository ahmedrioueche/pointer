// pages/auth/error.tsx
import { useRouter } from 'next/router';

const ErrorPage = () => {
    const router = useRouter();
    const { error } = router.query;

    return (
        <div>
            <h1>Sign In Error</h1>
            <p>{error}</p>
        </div>
    );
};

export default ErrorPage;
