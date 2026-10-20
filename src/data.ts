export interface Station {
  id: string
  name: string
  en: string
  x: number
  y: number
  lines: string[]
  district: string
  landmark: string
}

export interface Line {
  id: string
  name: string
  color: string
  stations: string[]
  desc: string
  length: string
  headway: string
}

export const stations: Station[] = [
  { id: 'central', name: '中央站', en: 'Central', x: 400, y: 300, lines: ['L1', 'L2', 'L3', 'L4'], district: '核心区', landmark: '全城换乘枢纽 · 老城钟楼' },
  { id: 'north', name: '北站', en: 'North', x: 400, y: 80, lines: ['L2'], district: '北区', landmark: '高铁北站 · 会展中心' },
  { id: 'south', name: '南站', en: 'South', x: 400, y: 520, lines: ['L2'], district: '南区', landmark: '南港码头 · 文创园' },
  { id: 'west', name: '西郊', en: 'West End', x: 90, y: 300, lines: ['L1'], district: '西郊', landmark: '森林公园 · 天文台' },
  { id: 'east', name: '东港', en: 'East Port', x: 710, y: 300, lines: ['L1'], district: '东区', landmark: '东港商务区 · 观景塔' },
  { id: 'ne', name: '东北', en: 'North-East', x: 600, y: 140, lines: ['L3'], district: '东北新区', landmark: '科技园 · 体育场' },
  { id: 'sw', name: '西南', en: 'South-West', x: 200, y: 460, lines: ['L3'], district: '西南区', landmark: '大学城 · 湿地公园' },
  { id: 'nw', name: '西北', en: 'North-West', x: 200, y: 140, lines: ['L4'], district: '西北区', landmark: '机场支线 · 物流园' },
  { id: 'se', name: '东南', en: 'South-East', x: 600, y: 460, lines: ['L4'], district: '东南区', landmark: '剧院 · 博物馆群' },
  { id: 'univ', name: '大学城', en: 'University', x: 245, y: 300, lines: ['L1'], district: '西区', landmark: '三所高校 · 书店街' },
  { id: 'tech', name: '科技园', en: 'Tech Park', x: 555, y: 300, lines: ['L1'], district: '东区', landmark: '软件园 · 孵化器' },
  { id: 'old', name: '老街', en: 'Old Town', x: 400, y: 190, lines: ['L2'], district: '核心区', landmark: '百年老街 · 夜市' },
  { id: 'lake', name: '湖心', en: 'Lake', x: 400, y: 410, lines: ['L2'], district: '核心区', landmark: '人工湖 · 湖畔步道' },
  { id: 'bayN', name: '北湾', en: 'North Bay', x: 240, y: 200, lines: ['LOOP'], district: '环线', landmark: '北湾公园 · 轮渡' },
  { id: 'gateE', name: '东门', en: 'East Gate', x: 560, y: 220, lines: ['LOOP'], district: '环线', landmark: '东城门 · 商圈' },
  { id: 'bayS', name: '南岸', en: 'South Bank', x: 560, y: 400, lines: ['LOOP'], district: '环线', landmark: '南岸滨江 · 步道' },
  { id: 'gateW', name: '西门', en: 'West Gate', x: 240, y: 400, lines: ['LOOP'], district: '环线', landmark: '西城门 · 古玩市场' },
]

export const lines: Line[] = [
  { id: 'L1', name: '1号线 · 东西动脉', color: '#ff4d8f', stations: ['west', 'univ', 'central', 'tech', 'east'], desc: '横贯全城的主干线路，连接西郊与东港。', length: '28.4 km', headway: '高峰 3 分钟' },
  { id: 'L2', name: '2号线 · 南北主轴', color: '#ffd166', stations: ['north', 'old', 'central', 'lake', 'south'], desc: '串联高铁北站与南港码头，夜班最晚的一条线。', length: '31.8 km', headway: '高峰 4 分钟' },
  { id: 'L3', name: '3号线 · 斜穿线', color: '#65f0b2', stations: ['ne', 'central', 'sw'], desc: '斜穿城市，把东北科技园与西南大学城接起来。', length: '22.1 km', headway: '高峰 5 分钟' },
  { id: 'L4', name: '4号线 · 机场支线', color: '#b78bff', stations: ['nw', 'central', 'se'], desc: '通往机场与博物馆群，游客最常用的一条线。', length: '24.7 km', headway: '高峰 6 分钟' },
  { id: 'LOOP', name: '环线 · 内环', color: '#4dd6ff', stations: ['bayN', 'gateE', 'bayS', 'gateW'], desc: '环绕老城的一圈，串起四座城门与滨水地带。', length: '19.6 km', headway: '高峰 5 分钟' },
]

export function linePath(line: Line): string {
  const pts = line.stations.map((id) => stations.find((s) => s.id === id)!)
  if (line.id === 'LOOP') {
    return `M${pts[0].x} ${pts[0].y} L${pts[1].x} ${pts[1].y} L${pts[2].x} ${pts[2].y} L${pts[3].x} ${pts[3].y} Z`
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
}
