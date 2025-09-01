import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchGithubUser } from "../api/github";
import UserCard from "./UserCard";

const UserSearch = () => {
  const [username, setUsername] = useState('')
  const [submittedUser, setSubmittedUser] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', submittedUser],
    queryFn: () => fetchGithubUser(submittedUser),
    enabled: !!submittedUser
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmittedUser(username.trim())
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter GitHub Username" />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {data && <UserCard user={data} />}
    </>
  );
}

export default UserSearch;