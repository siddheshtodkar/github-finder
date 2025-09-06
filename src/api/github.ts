const API_URL = import.meta.env.VITE_GITHUB_API_URL
const API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN

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

export const checkIfFollowingUser = async (username: string) => {
  const res = await fetch(`${API_URL}/user/following/${username}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  })
  if (res.status === 204)
    return true
  else if (res.status === 404)
    return false
  else
    throw new Error('failed to check follow status')
}

export const followUser = async (username: string) => {
  const res = await fetch(`${API_URL}/user/following/${username}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  })
  if (!res.ok)
    throw new Error('Failed to follow user')
  return true
}

export const unFollowUser = async (username: string) => {
  const res = await fetch(`${API_URL}/user/following/${username}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  })
  if (!res.ok)
    throw new Error('Failed to unfollow user')
  return true
}