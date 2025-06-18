// app/profile/[[...rest]]/page.js

import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <div>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
