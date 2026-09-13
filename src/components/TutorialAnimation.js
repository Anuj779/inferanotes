"use client";

import React from "react";

export default function TutorialAnimation() {
  return (
    <div className="tutorial-wrapper">
      <style>{`
        .tutorial-wrapper {
          width: 100%;
          max-width: 400px;
          margin: 10px auto;
          background: #0f0f0f;
          border-radius: 8px;
          border: 1px solid #333;
          padding: 12px;
          position: relative;
          overflow: hidden;
          font-family: sans-serif;
          user-select: none;
        }
        .yt-video {
          width: 100%;
          height: 100px;
          background: #272727;
          border-radius: 6px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          font-size: 12px;
        }
        .yt-desc {
          background: #272727;
          border-radius: 6px;
          padding: 8px;
          font-size: 10px;
          color: #aaa;
          position: relative;
        }
        .yt-more-btn {
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          display: inline-block;
          margin-top: 4px;
        }
        .yt-show-transcript-btn {
          display: inline-block;
          margin-top: 8px;
          border: 1px solid #717171;
          border-radius: 12px;
          padding: 4px 10px;
          color: #fff;
          font-weight: bold;
          opacity: 0;
          animation: showTranscriptBtn 8s infinite;
        }
        .yt-sidebar {
          position: absolute;
          top: 0;
          right: -150px;
          width: 140px;
          height: 100%;
          background: #0f0f0f;
          border-left: 1px solid #333;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: right 0.3s ease;
          animation: slideSidebar 8s infinite;
        }
        .yt-transcript-line {
          height: 8px;
          background: #717171;
          border-radius: 4px;
          width: 80%;
          animation: highlightText 8s infinite;
        }
        .yt-cursor {
          position: absolute;
          width: 16px;
          height: 16px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2"><path d="M4 2l6 20 4-6 6 6 2-2-6-6 6-4z"/></svg>');
          background-size: cover;
          z-index: 10;
          top: 40px;
          left: 50%;
          animation: moveCursor 8s infinite;
          pointer-events: none;
        }
        
        @keyframes showTranscriptBtn {
          0%, 15% { opacity: 0; }
          20%, 90% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes slideSidebar {
          0%, 35% { right: -150px; }
          40%, 90% { right: 0; }
          100% { right: -150px; }
        }
        
        @keyframes highlightText {
          0%, 55% { background: #717171; }
          65%, 90% { background: #3ea6ff; }
          100% { background: #717171; }
        }
        
        @keyframes moveCursor {
          0%, 5% { top: 40px; left: 50%; transform: scale(1); }
          15% { top: 125px; left: 30px; transform: scale(1); } /* Move to ...more */
          18% { top: 125px; left: 30px; transform: scale(0.8); } /* Click ...more */
          22% { top: 155px; left: 60px; transform: scale(1); } /* Move to Show transcript */
          25% { top: 155px; left: 60px; transform: scale(0.8); } /* Click Show transcript */
          35% { top: 50px; left: 80%; transform: scale(1); } /* Move to Sidebar */
          45% { top: 50px; left: 80%; transform: scale(1); }
          55% { top: 120px; left: 80%; transform: scale(1); } /* Drag highlight */
          90% { top: 120px; left: 80%; transform: scale(1); }
          100% { top: 40px; left: 50%; transform: scale(1); }
        }
      `}</style>
      
      <div className="yt-video">Video Player</div>
      
      <div className="yt-desc">
        <div style={{width: "60%", height: "8px", background: "#717171", borderRadius: "4px", marginBottom: "6px"}}></div>
        <div style={{width: "40%", height: "8px", background: "#717171", borderRadius: "4px"}}></div>
        <div className="yt-more-btn">...more</div>
        <br />
        <div className="yt-show-transcript-btn">Show transcript</div>
      </div>
      
      <div className="yt-sidebar">
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>Transcript</div>
        <div className="yt-transcript-line"></div>
        <div className="yt-transcript-line" style={{ width: "90%" }}></div>
        <div className="yt-transcript-line" style={{ width: "70%" }}></div>
        <div className="yt-transcript-line" style={{ width: "85%" }}></div>
        <div className="yt-transcript-line" style={{ width: "60%" }}></div>
      </div>
      
      <div className="yt-cursor"></div>
    </div>
  );
}
