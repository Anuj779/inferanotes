export default function YoutubeGuideSvg() {
  return (
    <svg viewBox="0 0 1000 500" width="100%" height="auto" style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "#0f0f0f", fontFamily: "sans-serif" }}>
      {/* Video Player */}
      <rect x="20" y="20" width="480" height="270" fill="#272727" rx="8" />
      <text x="260" y="155" fill="#fff" fontSize="16" textAnchor="middle">YouTube Video</text>
      
      {/* Description Box */}
      <rect x="20" y="300" width="480" height="80" fill="#272727" rx="8" />
      <text x="30" y="325" fill="#fff" fontSize="14" fontWeight="bold">Video Title goes here</text>
      <text x="30" y="345" fill="#aaa" fontSize="12">1M views • 2 weeks ago</text>
      <text x="30" y="365" fill="#aaa" fontSize="12">This is the description...</text>
      
      {/* ...more button highlighted */}
      <rect x="200" y="352" width="55" height="18" fill="#3ea6ff" rx="4" opacity="0.3" />
      <text x="205" y="365" fill="#fff" fontSize="12" fontWeight="bold">...more</text>
      
      {/* Show transcript button highlighted */}
      <rect x="30" y="385" width="120" height="24" fill="#3ea6ff" rx="12" opacity="0.3" />
      <text x="40" y="401" fill="#fff" fontSize="12" fontWeight="bold">Show transcript</text>
      
      {/* Sidebar Transcript */}
      <rect x="520" y="20" width="260" height="360" fill="#0f0f0f" stroke="#333" strokeWidth="1" rx="8" />
      <text x="535" y="45" fill="#fff" fontSize="16" fontWeight="bold">Transcript</text>
      <line x1="520" y1="55" x2="780" y2="55" stroke="#333" strokeWidth="1" />
      
      {/* Highlighted text in transcript */}
      <rect x="530" y="70" width="240" height="250" fill="#3ea6ff" rx="4" opacity="0.2" />
      
      <text x="535" y="85" fill="#aaa" fontSize="12">0:00</text>
      <text x="575" y="85" fill="#fff" fontSize="12">Welcome to this tutorial</text>
      
      <text x="535" y="115" fill="#aaa" fontSize="12">0:05</text>
      <text x="575" y="115" fill="#fff" fontSize="12">Today we are going to learn</text>
      
      <text x="535" y="145" fill="#aaa" fontSize="12">0:10</text>
      <text x="575" y="145" fill="#fff" fontSize="12">how to program in Python.</text>
      
      <text x="535" y="175" fill="#aaa" fontSize="12">0:15</text>
      <text x="575" y="175" fill="#fff" fontSize="12">Let's get started with the</text>
      
      <text x="535" y="205" fill="#aaa" fontSize="12">0:20</text>
      <text x="575" y="205" fill="#fff" fontSize="12">basics of variables.</text>
      
      {/* Pointers/Arrows */}
      <path d="M 225 350 L 225 320" stroke="#f1c40f" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="230" y="315" fill="#f1c40f" fontSize="14" fontWeight="bold">1. Click ...more</text>
      
      <path d="M 90 410 L 90 430" stroke="#f1c40f" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="95" y="445" fill="#f1c40f" fontSize="14" fontWeight="bold">2. Click Show transcript</text>
      
      <path d="M 775 200 L 805 200" stroke="#f1c40f" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="815" y="205" fill="#f1c40f" fontSize="14" fontWeight="bold">3. Copy all text here</text>

      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#f1c40f" />
        </marker>
      </defs>
    </svg>
  );
}
