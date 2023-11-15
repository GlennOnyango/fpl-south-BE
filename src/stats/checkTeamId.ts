import { api_url } from "../constants";
import fetch from "node-fetch";

export async function checkTeamId(teamId: number) {
    console.log(teamId);
    const userData = await fetch(`${api_url}entry/${teamId}/`, {
        method: "GET",
        redirect: "follow",
    });

    const userDataText = await userData.text();
    const userDataObject = JSON.parse(userDataText);

    if (userDataObject["id"] == teamId) {
        return true;
    }
  
  return false;
}
