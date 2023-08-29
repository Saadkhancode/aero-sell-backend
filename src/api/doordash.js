import { DoorDashClient } from "@doordash/sdk";
import { v4 as uuidv4 } from "uuid";

const client = new DoorDashClient({
  developer_id: "{your developer_id}",
  key_id: "{your key_id}",
  signing_secret: "{your signing_secret}",
});

const response = await client.createDelivery({
  external_delivery_id: uuidv4(),
  pickup_address: "1000 4th Ave, Seattle, WA, 98104",
  pickup_phone_number: "+1(650)5555555",
  dropoff_address: "1201 3rd Ave, Seattle, WA, 98101",
  dropoff_phone_number: "+1(650)5555555",
});