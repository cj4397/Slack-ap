import { useAuth } from "./auth";

export function useDatabase() {
    // const accessToken = process.env.ACCESS_TOKEN
    // const client = process.env.CLIENT
    // const expiry = process.env.EXPIRY
    // const uid = process.env.UID
    const { user_data } = useAuth();
    const { accessToken, client, expiry, uid } = user_data;


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

    const createGroupAPI = async (id: any) => {
        const url = "http://206.189.91.54/api/v1/channels";
        const method = "POST";
        const body = {
            name: id.name,
            user_ids: [id.id],
        };

        return fetchApi(url, method, body);
    };

    const joinGroupAPI = async (id: number) => {
        const url = "http://206.189.91.54/api/v1/channel/add_member";
        const method = "POST";
        const body = {
            id: id,
            member_id: id,
        };

        return fetchApi(url, method, body);
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

    const sendMessageAPIUser = async (data: any) => {
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
        const url = `http://206.189.91.54//api/v1/channels/${id}`;
        const method = "GET";

        return fetchApi(url, method);
    };

    const getMessage = async (id: any) => {
        const url = `http://206.189.91.54/api/v1/messages?receiver_id=${id}&receiver_class=Channel`;
        const method = "GET";

        return fetchApi(url, method);
    };

    const getUsers = async () => {
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
