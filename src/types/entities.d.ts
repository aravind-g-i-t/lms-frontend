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

export interface IAttachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

export interface IMessage{
    conversationId?:string;
    senderId:string;
    senderRole:"learner"|"instructor";
    content:string;
    attachments?:Attachment[];
    courseId?:string;
    receiverId?:string;
}

