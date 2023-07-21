import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { actions } from "./slice";

export function ShootingGame() {
  const dispatch = useDispatch();
  const canvas = useRef<HTMLCanvasElement>(null);

  return (
    <div style={{position: 'relative'}}>
      <canvas
        style={{
          margin: "0px auto",
          backgroundColor: "white",
          width: "640px",
          height: "480px",
        }}
        id="main_canvas"
        ref={canvas}
      ></canvas>
      <canvas
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          backgroundColor: "transparent",
          width: "300px",
          height: "10px",
        }}
        id="health_bar_canvas"
      ></canvas>
      <button
        style={{
          display: "block",
          margin: "auto",
        }}
        onClick={() => dispatch(actions.initialize(canvas.current!))}
      >
        start
      </button>
      <div
        style={{
          color: "#f0f0f0",
        }}
      >
        十字键: 移动
        <br />
        z: 攻击
        <br />
        Space: 暂停
        <br />
        Enter: 重新开始
      </div>
    </div>
  );
}
