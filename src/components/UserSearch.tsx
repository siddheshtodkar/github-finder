import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetchGithubUser, fetchGithubUserSuggestions } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";
import SuggestionsDropdown from "./SuggestionsDropdown";
import { useDebounce } from "use-debounce";

const UserSearch = () => {
  const [username, setUsername] = useState('')
  const [submittedUser, setSubmittedUser] = useState('')
  const [debouncedUsername] = useDebounce(username, 1000)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const recentSearches = localStorage.getItem('recentSearches')
    return recentSearches ? JSON.parse(recentSearches) : []
  })

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentUsers))
  }, [recentUsers])

  // query to fetch user data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', submittedUser],
    queryFn: () => fetchGithubUser(submittedUser),
    enabled: !!submittedUser
  })

  // query to fetch user suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['user-suggestions', debouncedUsername],
    queryFn: () => fetchGithubUserSuggestions(debouncedUsername),
    enabled: debouncedUsername.length > 2
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let trimmed = username.trim()
    if (!trimmed)
      return
    setSubmittedUser(trimmed)
    setUsername('')
    setRecentUsers(prev => {
      return [trimmed, ...prev.filter(item => item !== trimmed)].slice(0, 5)
    })
  }

  function selectRecentUser(user: string) {
    setUsername(user);
    setSubmittedUser(user)
  }

  function selectSuggestion(user: string) {
    setUsername(user);
    setShowSuggestions(false)
    if (submittedUser != user)
      setSubmittedUser(user)
    else
      refetch()
    setRecentUsers(prev => {
      return [user, ...prev.filter(item => item !== user)].slice(0, 5)
    })
  }

  function changeUsername(user: string) {
    setUsername(user)
    if (user.trim().length > 2)
      setShowSuggestions(true)
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div className="dropdown-wrapper">
          <input type="text" name="username" id="username" value={username} onChange={(e) => changeUsername(e.target.value)} placeholder="Enter GitHub Username" />
          {showSuggestions && suggestions?.length > 0 && <SuggestionsDropdown suggestions={suggestions} onSelect={(user) => selectSuggestion(user)} />}
        </div>
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {data && <UserCard user={data} />}
      {recentUsers.length > 0 && <RecentSearches users={recentUsers} onSelect={(user) => selectRecentUser(user)} />}
    </>
  );
}

export default UserSearch;