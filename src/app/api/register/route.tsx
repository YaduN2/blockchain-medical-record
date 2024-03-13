import axios from "axios";
import { NextApiRequest, NextApiResponse } from 'next'
import { type NextRequest } from 'next/server'
import {  NextResponse } from "next/server";
import {createUser , getUser } from "@/lib/mongoDb";

export  async function GET(req: NextRequest){
  console.log('GET request');
  // const searchParams = request.nextUrl.searchParams
  // const query = searchParams.get('query')
  return NextResponse.json({message: 'Hello World'});
}
 
export default async function POST(req: NextRequest){


  //post in blockchain
  
}
  
  
