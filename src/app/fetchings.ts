'use client'
import { useAuth } from "./Auth";

export function useDatabase() {
  const { userData } = useAuth();
  const { accessToken, client, expiry, uid } = userData;

  const fetchApi = async (url: string, method: string, body?: any) => {
    const headers = {
      "Content-Type": "application/json",
      "access-token": accessToken,
      "client": client,
      "expiry": expiry,
      "uid": uid,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

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
      const send = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'access-token': accessToken,
          'client': client,
          'expiry': expiry,
          'uid': uid,
        },
        body: JSON.stringify({
          id: id,
          member_id: id
        })
      });
      const responseBody = await send.json();
      console.log(responseBody);
    };

    const sendMessageAPI = async (data: any) => {
      const url = "http://206.189.91.54/api/v1/messages";
      const method = "POST";
      const body = {
        receiver_id: data.groupId,
        receiver_class: "Channel",
        body: String(data.message),
      };

      return fetchApi(url, method, body);
    };

    const sendMessageAPIUser = async (data: any): Promise<any> => {
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

    const getDetails = async (id: any) => {
      const url = `http://206.189.91.54/api/v1/channels/${id}`;
      const method = "GET";

      return fetchApi(url, method);
    };

    const getMessage = async (id: any) => {
      const url = `http://206.189.91.54/api/v1/messages?receiver_id=${id}&receiver_class=Channel`;
      const method = "GET";

      return fetchApi(url, method);
    };

    const getUsers = async (): Promise<any> => {
      const url = "http://206.189.91.54/api/v1/users";
      const method = "GET";

      return fetchApi(url, method);
    };

    const getMessageUser = async (id: any) => {
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
}
