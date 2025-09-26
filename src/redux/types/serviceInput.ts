export interface UpdateBusinessProfileInput{
    name:string;
    businessDomain:string|null;
    website:string|null;
    location:string|null;
}

export interface UpdateInstructorProfileInput{
    name:string;
    website:string|null;
    bio:string|null;
    designation:string|null;
}