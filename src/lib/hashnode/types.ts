export interface HashnodePost {
  id: string;
  title: string;
  content: string;
  brief: string;
  coverImage: {
    url: string;
    isPortrait: boolean;
    isAttributionHidden: boolean;
  };
  slug: string;
  publishedAt: string;
  tags: Array<{
    name: string;
    slug: string;
  }>;
  author: {
    name: string;
  };
}

export interface HashnodePostConnection {
  edges: Array<{
    node: HashnodePost;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export interface HashnodeResponse {
  data: {
    publication?: {
      posts: HashnodePostConnection;
    };
    post?: HashnodePost;
  };
  errors?: Array<{
    message: string;
  }>;
}
