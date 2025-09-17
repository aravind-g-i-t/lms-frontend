export interface ILearner{
    id:string;
    name:string;
    email:string;
    walletBalance:string;
    profilePic?:string;
}

export interface IInstructor{
    id:string;
    name:string;
    email:string;
    walletBalance:string;
    isVerified:boolean
    prifilePic?:string;
    resume?:string;
}

