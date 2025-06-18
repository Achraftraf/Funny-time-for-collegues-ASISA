"use client"; // Ensure this is a client component
import { UserButton, useUser } from "@clerk/nextjs"; // Use useUser

const MemberProfile = () => {
  const { user, isLoading, isSignedIn } = useUser(); // Use useUser

  // Log user authentication status and user object
  console.log("Is Signed In:", isSignedIn);
  console.log("User Data:", user); // Log user object

  // Directly return if the user is not signed in or data is still loading
  if (isLoading || !isSignedIn) {
    return null; // Return nothing if loading or not signed in
  }

  // Display user information
  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user?.emailAddresses[0]?.emailAddress || "No email available"}</p>
    </div>
  );
};

export default MemberProfile;
