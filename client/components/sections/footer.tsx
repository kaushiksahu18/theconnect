import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
          <div className="text-end md:text-start">
            <h3 className="text-lg font-semibold">theConnect</h3>
            <p className="text-sm text-white/90">
              Private peer-to-peer communication platform
            </p>
          </div>

          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-[#0066cc]"
            >
              <Github className="h-8 w-8" />
            </a>
            <a
              href="#"
              className="text-white/90 transition-colors hover:text-[#00ccaa]"
            >
              <Linkedin className="h-8 w-8" />
            </a>
          </div>
        </div>

        <div className="mt-2 border-t border-white pt-2">
          <p className="text-center text-sm text-white/90">
            © {new Date().getFullYear()} SecureChat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
