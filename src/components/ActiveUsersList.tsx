import { useUser } from "@/contexts/UserContext";

export const ActiveUsersList = () => {
  const { users, currentDrawingUser } = useUser();

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[600px]">
      <h3 className="text-sm font-semibold mb-3">Players</h3>
      <div className="flex flex-col gap-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`px-3 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105 ${
              currentDrawingUser === user.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary hover:bg-secondary-hover text-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">
                #{index + 1} {user.name} {currentDrawingUser === user.id ? "(Drawing)" : ""}
              </span>
              <span className="font-semibold ml-2 whitespace-nowrap">{user.points || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};