import { FaGithubAlt, FaUserMinus, FaUserPlus } from "react-icons/fa";
import type { GithubUser } from "../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkIfFollowingUser, followUser, unFollowUser } from "../api/github";
import { toast } from "sonner";

const UserCard = ({ user }: { user: GithubUser }) => {
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['follow-status', user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login
  })
  const { mutate: follow, isPending } = useMutation({
    mutationFn: () => followUser(user.login),
    onSuccess: () => {
      refetch()
      toast.success(`You are now following ${user.login}`)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
  const { mutate: unFollow, isPending: isLoading } = useMutation({
    mutationFn: () => unFollowUser(user.login),
    onSuccess: () => {
      refetch()
      toast.success(`You are no longer following ${user.login}`)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.name} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <p className="bio">{user.bio}</p>
      <div className="user-card-buttons">
        <button className={`follow-btn ${isFollowing ? 'following' : ''}`} onClick={() => { isFollowing ? unFollow() : follow() }} disabled={isPending || isLoading}>
          {isFollowing ? <><FaUserMinus />Following</> : <><FaUserPlus />Follow User</>}
        </button>
        <a href={user.html_url} className="profile-btn" target="_blank" rel="noopener noreferrer"><FaGithubAlt />View GitHub Profile</a>
      </div>
    </div>
  );
}

export default UserCard;