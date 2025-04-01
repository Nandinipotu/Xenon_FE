interface GoogleAuth {
    email: string;
    name: string;
    picture: string;
    ipAddress: string;
}


interface AuthState {
    loading: boolean;
    data: GoogleAuth[];  // Store the fetched data
    error: string | null;
}
