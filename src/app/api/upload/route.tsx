import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { createReadStream, unlink } from 'fs';
import pinataSDK from '@pinata/sdk'

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

async function saveFile(file) {
  try {
    const stream = createReadStream(file.filepath)
    const options = {
      pinataMetadata: {
        name: file.originalFilename,
      },
    }
    const response = await pinata.pinFileToIPFS(stream, options)
    unlink(file.filepath, (err) => {
      if (err) {
        throw err;
      }
    });

    return response
  } catch (error) {
    throw error
  }
}


export async function POST(req: NextRequest) {
  try {
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.error(err);
          reject(NextResponse.error());
        }
        try {
          const response = await saveFile(files.file);
          const { IpfsHash } = response;
          resolve(NextResponse.json({ IpfsHash }));
        } catch (e) {
          console.error(e);
          reject(NextResponse.error());
        }
      });
    });
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}