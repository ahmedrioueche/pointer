interface SignupDetails {
    [key: string]: any;
}

interface ResultType {
    success: boolean;
}

export const apiInsertDB = async (
    data: any,
    moreData: any,
    route: string
): Promise<ResultType> => {
    try {
        const response = await fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                ...moreData
            }),
        });

        const result = await response.json();

        return result;

    } catch (error) {
        console.error('Signup error:', error);
        return { success: false };
    }
};
