import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { ShieldCheck, Film, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SceneFind - The Search Engine for Video Scenepacks',
  description: 'Search movies, characters, or describe any scene, emotion, or edit vibe across 411, Veel, EditPacks, and Suits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0b0e] text-[#f3f4f6] flex flex-col antialiased selection:bg-accent-600 selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#08090b] py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1.5">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Film className="w-4 h-4 text-accent-400" />
                <span>SceneFind</span>
              </div>
              <p className="text-gray-400 text-center md:text-left max-w-md">
                Search engine indexing public metadata from community scenepack repositories. We do not host, store, or stream copyright video files.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
              <Link href="/debug" className="hover:text-white transition-colors">
                System Diagnostics
              </Link>
              <Link href="/search?q=Cruella&mode=exact" className="hover:text-white transition-colors">
                Cruella Packs
              </Link>
              <Link href="/search?q=emotional+clips&mode=vibe" className="hover:text-white transition-colors">
                Emotional Vibes
              </Link>
              <a
                href="https://scenepacks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                411 Scenepacks <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://veelscp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Veel SCP <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
