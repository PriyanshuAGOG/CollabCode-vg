import { Client, Account, ID, Databases, Query } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

if (!endpoint || !projectId) {
  throw new Error("Missing Appwrite environment variables");
}

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);

const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const collections = {
  profiles: "profiles",
  teams: "teams",
  team_members: "team_members",
  rooms: "rooms",
  room_members: "room_members",
  messages: "messages",
  call_sessions: "call_sessions",
};


// Auth functions
export const signUp = async (email: string, password: string, username: string) => {
  try {
    const user = await account.create(ID.unique(), email, password, username);
    if (user) {
      await createUserProfile(user.$id, username, email);
      const session = await account.createEmailPasswordSession(email, password);
      return { data: { user, session }, error: null };
    }
    return { data: null, error: "User creation failed" };
  } catch (error) {
    return { data: null, error };
  }
};

export const getTeamMembers = async (teamId: string) => {
  try {
    const data = await databases.listDocuments(dbId, collections.team_members, [
      Query.equal("team_id", teamId),
    ]);
    // TODO: fetch the full profile objects
    return { data: data.documents, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

// Profile functions
export const createUserProfile = async (userId: string, username: string, email: string) => {
  try {
    const doc = await databases.createDocument(
      dbId,
      collections.profiles,
      userId,
      {
        userId,
        username,
        email,
        status: "online",
        last_seen: new Date().toISOString(),
      }
    );
    return { data: doc, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getProfile = async (userId: string) => {
  try {
    const data = await databases.getDocument(dbId, collections.profiles, userId);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateUserStatus = async (userId: string, status: "online" | "offline" | "away" | "busy") => {
  try {
    const data = await databases.updateDocument(dbId, collections.profiles, userId, {
      status,
      last_seen: new Date().toISOString(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Team functions
export const getUserTeams = async (userId: string) => {
  try {
    const data = await databases.listDocuments(dbId, collections.team_members, [
      Query.equal("user_id", userId),
    ]);
    // TODO: fetch the full team objects
    return { data: data.documents, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createTeam = async (name: string, description: string, ownerId: string) => {
  try {
    const team = await databases.createDocument(dbId, collections.teams, ID.unique(), {
      name,
      description,
      owner_id: ownerId,
    });
    if (team) {
      await databases.createDocument(dbId, collections.team_members, ID.unique(), {
        team_id: team.$id,
        user_id: ownerId,
        role: "owner",
      });
    }
    return { data: team, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Room functions
export const getRoom = async (roomId: string) => {
  try {
    const data = await databases.getDocument(dbId, collections.rooms, roomId);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getTeamRooms = async (teamId: string) => {
  try {
    const data = await databases.listDocuments(dbId, collections.rooms, [Query.equal("team_id", teamId)]);
    return { data: data.documents, error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const createRoom = async (name: string, description: string, type: string, teamId: string, createdBy: string) => {
  try {
    const room = await databases.createDocument(dbId, collections.rooms, ID.unique(), {
      name,
      description,
      type,
      team_id: teamId,
      created_by: createdBy,
    });
    if (room) {
      await databases.createDocument(dbId, collections.room_members, ID.unique(), {
        room_id: room.$id,
        user_id: createdBy,
      });
    }
    return { data: room, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Message functions
export const getRoomMessages = async (roomId: string, limit = 50) => {
  try {
    const data = await databases.listDocuments(dbId, collections.messages, [
      Query.equal("room_id", roomId),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ]);
    // TODO: fetch user data for each message
    return { data: data.documents.reverse(), error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const sendMessage = async (roomId: string, content: string, type: string, userId: string) => {
  try {
    const data = await databases.createDocument(dbId, collections.messages, ID.unique(), {
      room_id: roomId,
      content,
      type,
      user_id: userId,
    });
    // TODO: fetch user data for the message
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Call functions
export const startCall = async (roomId: string, type: "voice" | "video", userId: string) => {
  try {
    const data = await databases.createDocument(dbId, collections.call_sessions, ID.unique(), {
      room_id: roomId,
      type,
      started_by: userId,
      participants: [userId],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const joinCall = async (callId: string, userId: string) => {
  try {
    const call = await databases.getDocument(dbId, collections.call_sessions, callId);
    if (call) {
      const participants = [...(call.participants || []), userId];
      const data = await databases.updateDocument(dbId, collections.call_sessions, callId, { participants });
      return { data, error: null };
    }
    return { data: null, error: "Call not found" };
  } catch (error) {
    return { data: null, error };
  }
};

export const endCall = async (callId: string) => {
  try {
    const data = await databases.updateDocument(dbId, collections.call_sessions, callId, {
      ended_at: new Date().toISOString(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// User presence
export const getOnlineUsers = async (teamId: string) => {
  try {
    // This is more complex in Appwrite, as it requires querying relations.
    // For now, returning an empty array.
    // A possible solution is to have a "teams" attribute in the profiles collection.
    console.warn("getOnlineUsers not implemented for Appwrite yet");
    return { data: [], error: null };
  } catch (error) {
    return { data: [], error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { data: session, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};


export default client;
