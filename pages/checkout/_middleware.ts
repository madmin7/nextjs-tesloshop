import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

import { getToken } from 'next-auth/jwt';



// export async function middleware( req: NextRequest ){

//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     console.log({session});

//     if( !session ) {
//         return NextResponse.redirect(`/auth/login?p=${ req.page.name }`);
//     }

//     return NextResponse.next();

//     // let url= req.nextUrl.clone();
//     // url.basePath = '/auth/login?p=';
//     // url.pathname = req.page.name!;

//     // const { token = '' } = req.cookies;

//     // try {
//     //     await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
//     //     return NextResponse.next();
//     // } catch (error) {
//     //      return NextResponse.redirect(url);
//     // }


// }


export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
   
    const { origin } = req.nextUrl
   
    if (!session) {
      const requestedPage = req.page.name
      return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`)
    }
   
    return NextResponse.next()
  }