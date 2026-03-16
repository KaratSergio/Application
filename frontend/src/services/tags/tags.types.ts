export interface Tag {
  id: string;
  name: string;
}

export interface TagsApiResponse {
  data: Tag[];
  total: number;
}

export interface TagFilters {
  search?: string;
  sort?: 'name' | 'createdAt';
  order?: 'ASC' | 'DESC';
}