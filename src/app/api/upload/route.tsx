// //TODO:
// 1.save the file to server
// 2. save it to ipfs 
// 3. save the ipfs hash to blockchain 
import { NextResponse, NextRequest } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    

    // get the file from the formdata from request 
    // const formData = await request.formData();
    // const file = formData.get('file') as File;

  
    // send this file to ipfs so add this file to the body of the request


    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZjI0ZTFhZC0wZGJhLTQ0OTEtOTI4My02YzMwODAxMWIyZDEiLCJlbWFpbCI6InJpcm9tYTM5MzZAaGRybG9nLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5MWRiMzM5NzI0ZDIxNDBiYWEzMiIsInNjb3BlZEtleVNlY3JldCI6ImQ4NTFlY2RjZWU2ZmVjY2RhZjYwNWM2OGU0MTk4NzRhODRlZjM4OTRjYzQ4ZmJiOTlkNThhM2FiNDI3ZjQ3ZDkiLCJpYXQiOjE3MTAxODYxNTJ9.i_3z6yOLn89MOxdcP_HChOwbrDLLskXmvQHSdPXrzAE',
        'Content-Type': 'application/json'
      },
      body: '{"pinataContent":{"name":"samewose"}}'
    };
    
    fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}