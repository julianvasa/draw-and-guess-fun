import { useUser } from "@/contexts/UserContext";

export const UserList = () => {
  const { users } = useUser();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Users:</span>
      <div className="flex gap-2">
        {users.map((user, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-secondary rounded-full"
          >
            {user}
          </span>
        ))}
      </div>
    </div>
  );
};