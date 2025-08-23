import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  createTeam,
  getUserTeams,
  createRoom,
  getTeamRooms,
  sendMessage,
  getRoomMessages,
  getProfile,
} from "../lib/appwrite";

const testUser = {
  email: `testuser-${Date.now()}@example.com`,
  password: "password123",
  username: `testuser-${Date.now()}`,
};

let testUserId: string;
let testTeamId: string;
let testRoomId: string;

async function runTests() {
  console.log("Starting Appwrite migration tests...");

  try {
    // Test 1: Sign up
    console.log("Test 1: Signing up a new user...");
    const { data: signUpData, error: signUpError } = await signUp(
      testUser.email,
      testUser.password,
      testUser.username
    );
    if (signUpError) throw new Error(`Sign up failed: ${signUpError}`);
    if (!signUpData) throw new Error("Sign up did not return data");
    testUserId = signUpData.user.$id;
    console.log("✅ Sign up successful.");

    // Test 2: Get current user
    console.log("Test 2: Getting current user...");
    const user = await getCurrentUser();
    if (!user) throw new Error("Could not get current user");
    if (user.$id !== testUserId)
      throw new Error("Current user ID does not match signed up user ID");
    console.log("✅ Get current user successful.");

    // Test 3: Get profile
    console.log("Test 3: Getting user profile...");
    const { data: profile, error: profileError } = await getProfile(testUserId);
    if (profileError) throw new Error(`Get profile failed: ${profileError}`);
    if (!profile) throw new Error("Profile not found");
    if (profile.username !== testUser.username)
      throw new Error("Profile username does not match");
    console.log("✅ Get profile successful.");

    // Test 4: Create team
    console.log("Test 4: Creating a new team...");
    const { data: team, error: teamError } = await createTeam(
      "Test Team",
      "A team for testing",
      testUserId
    );
    if (teamError) throw new Error(`Create team failed: ${teamError}`);
    if (!team) throw new Error("Team not created");
    testTeamId = team.$id;
    console.log("✅ Create team successful.");

    // Test 5: Get user teams
    console.log("Test 5: Getting user teams...");
    const { data: teams, error: teamsError } = await getUserTeams(testUserId);
    if (teamsError) throw new Error(`Get user teams failed: ${teamsError}`);
    if (!teams || teams.length === 0) throw new Error("No teams found for user");
    if (!teams.find((t: any) => t.team_id === testTeamId))
      throw new Error("Test team not found in user teams");
    console.log("✅ Get user teams successful.");

    // Test 6: Create room
    console.log("Test 6: Creating a new room...");
    const { data: room, error: roomError } = await createRoom(
      "Test Room",
      "A room for testing",
      "channel",
      testTeamId,
      testUserId
    );
    if (roomError) throw new Error(`Create room failed: ${roomError}`);
    if (!room) throw new Error("Room not created");
    testRoomId = room.$id;
    console.log("✅ Create room successful.");

    // Test 7: Get team rooms
    console.log("Test 7: Getting team rooms...");
    const { data: rooms, error: roomsError } = await getTeamRooms(testTeamId);
    if (roomsError) throw new Error(`Get team rooms failed: ${roomsError}`);
    if (!rooms || rooms.length === 0) throw new Error("No rooms found for team");
    if (!rooms.find((r: any) => r.$id === testRoomId))
      throw new Error("Test room not found in team rooms");
    console.log("✅ Get team rooms successful.");

    // Test 8: Send message
    console.log("Test 8: Sending a message...");
    const { data: message, error: messageError } = await sendMessage(
      testRoomId,
      "Hello, world!",
      "text",
      testUserId
    );
    if (messageError) throw new Error(`Send message failed: ${messageError}`);
    if (!message) throw new Error("Message not sent");
    console.log("✅ Send message successful.");

    // Test 9: Get room messages
    console.log("Test 9: Getting room messages...");
    const { data: messages, error: messagesError } = await getRoomMessages(
      testRoomId
    );
    if (messagesError)
      throw new Error(`Get room messages failed: ${messagesError}`);
    if (!messages || messages.length === 0)
      throw new Error("No messages found in room");
    if (messages[0].content !== "Hello, world!")
      throw new Error("Message content does not match");
    console.log("✅ Get room messages successful.");

    // Test 10: Sign out
    console.log("Test 10: Signing out...");
    const { error: signOutError } = await signOut();
    if (signOutError) throw new Error(`Sign out failed: ${signOutError}`);
    const signedOutUser = await getCurrentUser();
    if (signedOutUser) throw new Error("User is still signed in");
    console.log("✅ Sign out successful.");

    console.log("🎉 All tests passed successfully!");
  } catch (error) {
    console.error("🔥 Test failed:", error);
    process.exit(1);
  }
}

runTests();
