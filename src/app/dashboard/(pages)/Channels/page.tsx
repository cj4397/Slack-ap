'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/app/Auth";
import { useDatabase } from "@/app/fetchings";

export default function ChannelsPage() {
  const { user } = useAuth();
  const { getChannels } = useDatabase();
  const [channelList, setChannelList] = useState([]);

  useEffect(() => {
    async function fetchChannels() {
      const result = await getChannels();
      setChannelList(result.data);
    }
    fetchChannels();
  }, [getChannels]);

  const makeChannelList = channelList.map((channel: any) => (
    <div key={channel.id}>
      <p>{channel.name}</p>
      <p>{channel.description}</p>
      {/* Render additional channel details */}
    </div>
  ));

  return (
    <>
      <h1>Channels Page</h1>
      {makeChannelList}
    </>
  );
}