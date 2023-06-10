import { useAuth }from "./auth";

interface UserData {
  accessToken: string;
  client: string;
  expiry: string;
  uid: string;
}

export function useDatabase() {
  const { userData } = useAuth();
  const { accessToken, client, expiry, uid } = userData as UserData;
  

  const fetchApi = async (url: string, method: string, body?: any) => {
    const headers = {
      "Content-Type": "application/json",
      "access-token": accessToken,
      client,
      expiry,
      uid,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return response.json();
  };

  const createGroupAPI = async (name: string, user_ids: number[]) => {
    const url = "http://206.189.91.54/api/v1/channels";
    const method = "POST";
    const body = {
      name,
      user_ids,
    };

    return fetchApi(url, method, body);
  };

  const joinGroupAPI = async (id: number) => {
    const url = "http://206.189.91.54/api/v1/channel/add_member";
    const method = "POST";
    const body = {
      id,
      member_id: id,
    };

    await fetchApi(url, method, body);
  };

  const sendMessageAPI = async (data: {
    groupId: number;
    message: string;
  }) => {
    const url = "http://206.189.91.54/api/v1/messages";
    const method = "POST";
    const body = {
      receiver_id: data.groupId,
      receiver_class: "Channel",
      body: String(data.message),
    };

    return fetchApi(url, method, body);
  };

  const sendMessageAPIUser = async (data: {
    userId: number;
    message: string;
  }): Promise<any> => {
    const url = "http://206.189.91.54/api/v1/messages";
    const method = "POST";
    const body = {
      receiver_id: data.userId,
      receiver_class: "User",
      body: String(data.message),
    };

    return fetchApi(url, method, body);
  };

  const getChannels = async () => {
    const url = "http://206.189.91.54/api/v1/channels";
    const method = "GET";

    return fetchApi(url, method);
  };

  const getDetails = async (id: number) => {
    const url = `http://206.189.91.54/api/v1/channels/${id}`;
    const method = "GET";

    return fetchApi(url, method);
  };

  const getMessage = async (id: number) => {
    const url = `http://206.189.91.54/api/v1/messages?receiver_id=${id}&receiver_class=Channel`;
    const method = "GET";

    return fetchApi(url, method);
  };

  const getUsers = async (): Promise<any> => {
    const url = "http://206.189.91.54/api/v1/users";
    const method = "GET";

    return fetchApi(url, method);
  };

  const getMessageUser = async (id: number) => {
    const url = `http://206.189.91.54/api/v1/messages?receiver_id=${id}&receiver_class=User`;
    const method = "GET";

    return fetchApi(url, method);
  };

  return {
    createGroupAPI,
    joinGroupAPI,
    sendMessageAPI,
    sendMessageAPIUser,
    getChannels,
    getDetails,
    getMessage,
    getUsers,
    getMessageUser,
  };
}

export default useDatabase;
