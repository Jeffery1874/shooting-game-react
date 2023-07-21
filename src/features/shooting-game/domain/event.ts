import { EventEmitter } from "events";
import { Shot } from "./model/shot";
import { Character } from "./model/character";
import store from "../../../app/store";
import { actions } from "../slice";
import { Enemy } from "./model/enemy";
import { Boss } from "./model/boss";
import { Viper } from "./model/viper";

export class Event {
  emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public addOnDestroyEvent() {
    this.emitter.on(
      "destroy",
      ({ self, target }: { self: Shot | Enemy; target: Character }) => {
        if (target.life <= 0) {
          for (let i = 0; i < self.explosionArray.length; ++i) {
            // 発生していない爆発エフェクトがあれば対象の位置に生成する
            if (!self.explosionArray[i].life) {
              self.explosionArray[i].set(target.position.x, target.position.y);
              break;
            }
          }

          // もし対象が敵キャラクターの場合はスコアを加算する
          if (target instanceof Enemy) {
            // 敵キャラクターの行動タイプによってスコアが変化するようにする
            let score = 100;
            if (target.action.constructor.name === "Large") {
              score = 1000;
            }

            if (target instanceof Boss) {
              score = 10000;
            }
            if (target instanceof Boss) {
              const healthBarCanvas: any = document.getElementById("health_bar_canvas");
              const ctx = healthBarCanvas.getContext("2d");
              ctx.clearRect(0, 0, healthBarCanvas.width, healthBarCanvas.height);
            }
            // スコアシステムにもよるが仮でここでは最大スコアを制限
            store.dispatch(actions.addPoint(Math.min(score, 99999)));
          }
        } else {
          //减少boss血量
          if (target instanceof Boss) {
            const healthBarCanvas: any =
              document.getElementById("health_bar_canvas");
            if (healthBarCanvas) {
              healthBarCanvas.style.left = `190px`;
              healthBarCanvas.style.top = `38px`;
              const ctx = healthBarCanvas.getContext("2d");
              ctx.clearRect(
                0,
                0,
                healthBarCanvas.width,
                healthBarCanvas.height
              );
              const healthBarWidth =
                (target.life / target.maxLife) * healthBarCanvas.width;
              ctx.fillStyle = "#ff0000"; // 血条颜色为红色
              ctx.fillRect(0, 0, healthBarWidth, healthBarCanvas.height);
            }
          }
        }

        if (self instanceof Shot) {
          // Shotの場合、衝突すると消滅させる
          self.life = 0;
        }

        if (target instanceof Viper && target.lives >= 1) {
          target.respawn();
        }
      }
    );
  }
}
