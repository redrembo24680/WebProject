import client from '../api/client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: number;
}

export interface NoteCreate {
  title: string;
  content: string;
}

export const authService = {
  register: (email: string, password: string) =>
    client.post<UserResponse>('/auth/register', { email, password }),
  
  login: (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return client.post<LoginResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verify: (token: string) =>
    client.get(`/auth/verify`, { params: { token } }),
};

export const notesService = {
  getAll: () => client.get<Note[]>('/notes'),

  create: (title: string, content: string, file?: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }
    return client.post<Note>('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id: number) => client.delete(`/notes/${id}`),
};
