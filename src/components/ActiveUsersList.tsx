import { useUser } from "@/contexts/UserContext";

export const ActiveUsersList = () => {
  const { users, currentDrawingUser } = useUser();

  return (
    <div className="w-full lg:w-48 bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-20">
      <h3 className="text-sm font-semibold mb-3">Active Users</h3>
      <div className="flex flex-wrap lg:flex-col gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex-1 lg:flex-none px-3 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105 ${
              currentDrawingUser === user.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary hover:bg-secondary-hover"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>
                {user.name} {currentDrawingUser === user.id ? "(Drawing)" : ""}
              </span>
              <span className="font-semibold ml-2">{user.points || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};