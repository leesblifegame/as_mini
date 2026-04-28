/*
 * Ocean tower-defense UI skin for canvas games.
 * Coordinate system is tuned for a 480x854 mobile canvas, but every helper
 * accepts explicit rectangles so it can be reused in other layouts.
 */
(function(global) {
  'use strict';

  const OceanUISkin = {
    colors: {
      page: '#03111f',
      panel: '#071b31',
      panel2: '#0b2744',
      panel3: '#123a5b',
      line: '#2d6d9d',
      lineSoft: 'rgba(112,196,255,.28)',
      glow: 'rgba(54,190,255,.62)',
      text: '#f4fbff',
      muted: '#9db8d4',
      gold: '#ffd15a',
      red: '#ff6d48',
      green: '#59d86b',
      blue: '#38b7ff'
    },

    roundRect(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    },

    panel(ctx, x, y, w, h, opts = {}) {
      const r = opts.radius ?? 9;
      const c1 = opts.c1 ?? this.colors.panel;
      const c2 = opts.c2 ?? this.colors.panel2;
      const stroke = opts.stroke ?? this.colors.lineSoft;
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, c2);
      g.addColorStop(.55, c1);
      g.addColorStop(1, '#041323');
      ctx.save();
      ctx.shadowColor = opts.glow ?? 'rgba(0,0,0,.45)';
      ctx.shadowBlur = opts.shadowBlur ?? 10;
      ctx.shadowOffsetY = 2;
      this.roundRect(ctx, x, y, w, h, r);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = opts.lineWidth ?? 1.5;
      ctx.strokeStyle = stroke;
      ctx.stroke();
      if (opts.highlight !== false) {
        ctx.globalAlpha = .55;
        ctx.strokeStyle = 'rgba(166,226,255,.22)';
        ctx.lineWidth = 1;
        this.roundRect(ctx, x + 2, y + 2, w - 4, h - 4, Math.max(2, r - 2));
        ctx.stroke();
      }
      ctx.restore();
    },

    fitText(ctx, text, x, y, maxWidth, size, weight = 800, color = '#fff', align = 'left') {
      ctx.save();
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      let s = size;
      do {
        ctx.font = `${weight} ${s}px Arial, sans-serif`;
        if (ctx.measureText(text).width <= maxWidth || s <= 10) break;
        s -= 1;
      } while (s > 10);
      ctx.fillText(text, x, y);
      ctx.restore();
    },

    iconCircle(ctx, cx, cy, r, type, color) {
      ctx.save();
      const g = ctx.createRadialGradient(cx - r * .3, cy - r * .35, 2, cx, cy, r);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(.22, color);
      g.addColorStop(1, '#10243d');
      ctx.shadowColor = color;
      ctx.shadowBlur = 11;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(r * 1.15)}px Arial, sans-serif`;
      const glyph = { life: '♥', gold: '$', gem: '◆', atk: '⚔', range: '⌖', speed: '➤', target: '◎' }[type] || type;
      ctx.fillText(glyph, cx, cy + (type === 'gold' ? 1 : 0));
      ctx.restore();
    },

    hudStat(ctx, x, y, w, h, icon, value, label, color) {
      this.panel(ctx, x, y, w, h, { radius: 8 });
      this.iconCircle(ctx, x + 25, y + h * .38, 13, icon, color);
      this.fitText(ctx, String(value), x + 45, y + h * .36, w - 56, 18, 900, this.colors.text);
      this.fitText(ctx, label, x + w / 2, y + h - 17, w - 16, 12, 800, this.colors.muted, 'center');
    },

    wavePanel(ctx, x, y, w, h, wave, total) {
      this.panel(ctx, x, y, w, h, { radius: 8 });
      this.fitText(ctx, 'WAVE', x + 14, y + 21, 58, 15, 900, '#9eb9d7');
      this.fitText(ctx, `${wave}/${total}`, x + 78, y + 21, 70, 21, 900, this.colors.text);
      const py = y + h - 18;
      ctx.save();
      ctx.strokeStyle = 'rgba(198,218,234,.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 17, py);
      ctx.lineTo(x + w - 24, py);
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i === 0 ? this.colors.gold : '#7692aa';
        ctx.beginPath();
        ctx.arc(x + 18 + i * ((w - 44) / 3), py, i === 0 ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = '14px Arial';
      ctx.fillStyle = '#9eb9d7';
      ctx.fillText('☠', x + w - 18, py + 4);
      ctx.restore();
    },

    roundButton(ctx, cx, cy, r, label) {
      ctx.save();
      const g = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
      g.addColorStop(0, '#173b67');
      g.addColorStop(1, '#07162a');
      ctx.shadowColor = 'rgba(54,163,255,.45)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2d6dba';
      ctx.stroke();
      this.fitText(ctx, label, cx, cy + 1, r * 1.45, 18, 900, '#8dccff', 'center');
      ctx.restore();
    },

    towerInfo(ctx, x, y, w, h, towerIcon) {
      this.panel(ctx, x, y, w, h, { radius: 8, c1: '#082036', c2: '#0e2b49' });
      this.panel(ctx, x + 9, y + 9, 62, h - 18, { radius: 7, c1: '#172f58', c2: '#263f72', stroke: '#6da6e6' });
      if (towerIcon) ctx.drawImage(towerIcon, x + 15, y + 15, 50, 50);
      else this.iconCircle(ctx, x + 40, y + h / 2, 24, '◆', '#c579ff');
      this.fitText(ctx, '조개 포격수', x + 84, y + 25, 105, 18, 900, '#fff');
      this.panel(ctx, x + 174, y + 13, 44, 24, { radius: 12, c1: '#12243b', c2: '#1a3558', stroke: 'rgba(161,202,255,.4)', shadowBlur: 0, highlight: false });
      this.fitText(ctx, 'Lv.1', x + 196, y + 25, 34, 13, 900, '#dcecff', 'center');
      const stats = [
        ['atk', '공격력', '55', '#8ec7ff'],
        ['range', '사거리', '145', '#9bcfff'],
        ['speed', '공속', '0.5/s', '#8ec7ff'],
        ['target', '타겟', '지상', '#9bcfff']
      ];
      for (let i = 0; i < stats.length; i++) {
        const sx = x + 95 + i * 76;
        this.iconCircle(ctx, sx, y + 52, 9, stats[i][0], stats[i][3]);
        this.fitText(ctx, stats[i][1], sx + 17, y + 48, 48, 11, 800, this.colors.muted);
        this.fitText(ctx, stats[i][2], sx + 17, y + 68, 56, 15, 900, '#fff');
        if (i > 0) {
          ctx.strokeStyle = 'rgba(132,174,208,.28)';
          ctx.beginPath();
          ctx.moveTo(sx - 18, y + 39);
          ctx.lineTo(sx - 18, y + h - 15);
          ctx.stroke();
        }
      }
      this.panel(ctx, x + w - 64, y + 10, 52, h - 20, { radius: 8, c1: '#063462', c2: '#1265a9', stroke: '#45b7ff', glow: 'rgba(37,157,255,.45)' });
      this.fitText(ctx, '⬆', x + w - 38, y + 31, 28, 21, 900, '#bdeaff', 'center');
      this.fitText(ctx, '판매', x + w - 38, y + 53, 36, 11, 900, '#cfeaff', 'center');
      this.iconCircle(ctx, x + w - 48, y + 70, 7, 'gold', '#ffd15a');
      this.fitText(ctx, '67', x + w - 30, y + 70, 20, 13, 900, '#fff', 'center');
    },

    upgradeCard(ctx, x, y, w, h, cfg) {
      const colorMap = {
        red: ['#451208', '#c64228', '#ff7148'],
        green: ['#0b3514', '#26a93d', '#75eb75'],
        blue: ['#062644', '#1280cf', '#5ed8ff']
      };
      const cc = colorMap[cfg.theme || 'blue'];
      this.panel(ctx, x, y, w, h, { radius: 8, c1: cc[0], c2: cc[1], stroke: cc[2], glow: `${cc[2]}55` });
      const headH = 34;
      const hg = ctx.createLinearGradient(x, y, x, y + headH);
      hg.addColorStop(0, cc[1]);
      hg.addColorStop(1, cc[0]);
      this.roundRect(ctx, x + 2, y + 2, w - 4, headH, 7);
      ctx.fillStyle = hg;
      ctx.fill();
      ctx.strokeStyle = `${cc[2]}aa`;
      ctx.stroke();
      this.fitText(ctx, cfg.icon || '✦', x + 30, y + 20, 24, 18, 900, '#ffe6aa', 'center');
      this.fitText(ctx, cfg.title, x + 50, y + 20, w - 62, 17, 900, '#fff');
      const orb = ctx.createRadialGradient(x + w / 2 - 12, y + 78 - 12, 3, x + w / 2, y + 78, 35);
      orb.addColorStop(0, '#fff');
      orb.addColorStop(.25, cc[2]);
      orb.addColorStop(1, 'rgba(0,0,0,.15)');
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 78, 27, 0, Math.PI * 2);
      ctx.fill();
      this.fitText(ctx, cfg.effect, x + w / 2, y + h - 50, w - 18, 16, 900, '#fff', 'center');
      this.panel(ctx, x + 18, y + h - 32, w - 36, 24, { radius: 6, c1: `${cc[0]}`, c2: `${cc[1]}`, stroke: `${cc[2]}bb`, shadowBlur: 0, highlight: false });
      this.iconCircle(ctx, x + w / 2 - 28, y + h - 20, 8, 'gold', '#ffd15a');
      this.fitText(ctx, String(cfg.cost), x + w / 2 + 8, y + h - 20, 46, 16, 900, '#fff', 'center');
    },

    bottomTab(ctx, x, y, w, h, label, icon, active) {
      this.panel(ctx, x, y, w, h, {
        radius: 8,
        c1: active ? '#14253a' : '#06182b',
        c2: active ? '#24384d' : '#0a2037',
        stroke: active ? '#d4ad62' : 'rgba(70,143,205,.36)',
        shadowBlur: active ? 8 : 4,
        highlight: active
      });
      this.fitText(ctx, icon, x + w * .35, y + h / 2 + 1, 26, 19, 900, active ? '#ffd66e' : '#84a4c2', 'center');
      this.fitText(ctx, label, x + w * .55, y + h / 2 + 1, 70, 16, 900, active ? '#ffd66e' : '#8ca8c5', 'center');
    },

    drawMockHUD(ctx, w = 480) {
      this.hudStat(ctx, 12, 8, 69, 47, 'life', 20, '생명', '#ff3e3e');
      this.hudStat(ctx, 88, 8, 81, 47, 'gold', 89, '골드', '#ffc72c');
      this.hudStat(ctx, 176, 8, 81, 47, 'gem', 20, '보석', '#be5cff');
      this.wavePanel(ctx, 264, 8, 108, 47, 1, 40);
      this.roundButton(ctx, 400, 31, 25, 'Ⅱ');
      this.roundButton(ctx, 450, 31, 25, '1x');
    }
  };

  global.OceanUISkin = OceanUISkin;
})(window);
