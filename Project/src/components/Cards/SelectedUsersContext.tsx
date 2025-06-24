import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedUsersProviderProps {
  children: ReactNode;
}

interface SelectedUsersContextType {
  selectedUsers: string[]; // Example type for selectedUsers
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

const SelectedUsersContext = createContext<
  SelectedUsersContextType | undefined
>(undefined);

export const useSelectedUsers = () => {
  const context = useContext(SelectedUsersContext);
  if (!context) {
    throw new Error(
      "useSelectedUsers must be used within a SelectedUsersProvider"
    );
  }
  return context;
};

export const SelectedUsersProvider: React.FC<SelectedUsersProviderProps> = ({
  children,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const updateSelectedUsers = (newSelectedUsers: string[]) => {
    setSelectedUsers(newSelectedUsers);
  };

  return (
    <SelectedUsersContext.Provider
      value={{ selectedUsers, updateSelectedUsers }}
    >
      {children}
    </SelectedUsersContext.Provider>
  );
};
