import React from "react";

type DirectMessagesColumnProps = {
  users: any[];
  onUserClick: (userId: number) => void;
};

const DirectMessagesColumn: React.FC<DirectMessagesColumnProps> = ({
  users,
  onUserClick,
}) => {
  return (
    <div className="direct-messages-column">
    </div>
  );
};

export default DirectMessagesColumn;
