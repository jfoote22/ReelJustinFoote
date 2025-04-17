import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle Microsoft Hololens Logo Trim.mp4 with spaces to MicrosoftHololensLogoTrim.mp4
  if (pathname.includes('/video_reels/Microsoft%20Hololens%20Logo%20Trim.mp4') || 
      pathname.includes('/video_reels/Microsoft Hololens Logo Trim.mp4')) {
    
    // Redirect to the version without spaces
    const url = request.nextUrl.clone();
    url.pathname = '/video_reels/MicrosoftHololensLogoTrim.mp4';
    
    console.log(`Redirecting ${pathname} to ${url.pathname}`);
    return NextResponse.redirect(url);
  }
  
  // Continue with the request for all other cases
  return NextResponse.next();
}

// Match only requests to video_reels
export const config = {
  matcher: '/video_reels/:path*',
}; 