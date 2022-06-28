export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: { 
        name : string;
        image : string;
    };
    description: string;
    slug: {
        current: string;
    };
    body:[object];
    mainImage: string;

}