const API_URL = import.meta.env.VITE_GITHUB_API_URL

export const fetchGithubUser = async (username: string) => {
  const res = await fetch(`${API_URL}/users/${username}`)
  if (!res.ok)
    throw new Error('User Not Found')
  const data = await res.json()
  return data
}

export const fetchGithubUserSuggestions = async (username: string) => {
  const res = await fetch(`${API_URL}/search/users?q=${username}`)
  if (!res.ok)
    throw new Error('User Not Found')
  const data = await res.json()
  return data.items
}