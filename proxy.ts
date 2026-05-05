import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const {pathname} = request.nextUrl

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isPublicAsset = pathname.startsWith('/_next') || pathname.includes('/favicon.ico');

    //khong co session va khong o trang login thi redirect ve trang login
    if(!session && !isAuthPage && !isPublicAsset) {
        const loginUrl = new URL('/login', request.url)

        // loginUrl.searchParams.set('callbackUrl', pathname)

        return NextResponse.redirect(loginUrl)
    }

    //Neu da login va co gang truy cap vao trang login thi day ra trang home
    if(session && isAuthPage) {

        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}