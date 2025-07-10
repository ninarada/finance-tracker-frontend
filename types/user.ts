export interface User {
    _id: string;
    username: string;
    email: string;
    token: string;
}
  
export interface UpdatedProfileData {
    name?: string;
    surname?: string;
    location?: string;
    bio?: string;
    photo?: {
        uri: string;
        name: string;
        type: string;
    } | null;
}
  