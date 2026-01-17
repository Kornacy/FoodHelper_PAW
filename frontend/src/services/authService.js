import api from './api'

export const registerUser = async (userData) => {
    const res = await api.post('/api/user/register', userData);
    return res.data
}
export const login = async (userData) => {
    const res = await api.post('/api/user/login',userData)
    return res.data
}