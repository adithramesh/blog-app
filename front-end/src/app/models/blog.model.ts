export interface BlogRequestDTO {
  title: string;            
  content: string;          
  imageUrl?: string;        
  authorId: string;         
}


export interface BlogResponseDTO {
  id?: string;               
  title: string;            
  content: string;          
  imageUrl?: string;        
  author: {                 
    id: string;
    username?: string;
  };
  createdAt: string;        
  updatedAt: string;       
  message?: string;         
}

export interface BlogListResponseDTO {
  total: number;                
  blogs: BlogResponseDTO[];     
}
