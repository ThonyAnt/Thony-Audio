export const metadata = {
  title: "support — thony audio",
}

export default function SupportPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-2xl mx-auto">
      <h1 className="font-display text-6xl text-[#1a1a1a] mb-6">support</h1>
      <p className="text-[#8a837c] leading-relaxed mb-8">
        having an issue or a question? reach out and we&apos;ll get back to you.
      </p>

      <div className="bg-[#edeae4] rounded-2xl p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl text-[#1a1a1a] mb-1">email</h2>
          <a
            href="mailto:hello@thonyaudio.com"
            className="text-[#b85c3a] hover:underline text-sm"
          >
            hello@thonyaudio.com
          </a>
        </div>

        <div className="border-t border-[#d8d4ce] pt-6">
          <h2 className="font-display text-2xl text-[#1a1a1a] mb-3">common questions</h2>
          <div className="space-y-4 text-sm text-[#8a837c]">
            <div>
              <p className="text-[#1a1a1a] font-medium mb-1">which formats are included?</p>
              <p>all plugins ship as VST3, AU, and AAX.</p>
            </div>
            <div>
              <p className="text-[#1a1a1a] font-medium mb-1">which DAWs are supported?</p>
              <p>any DAW that supports VST3 or AU on mac/windows. tested on ableton, logic, bitwig, and reaper.</p>
            </div>
            <div>
              <p className="text-[#1a1a1a] font-medium mb-1">can i use the plugins commercially?</p>
              <p>yes, all plugins are royalty-free for personal and commercial use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
