# src/index.tsx

```tsx
import React, { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n || 0));

function polygonArea(points: { x: number; y: number }[]) {
  if (points.length < 3) return 0;

  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;

    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area / 2);
}

function Blueprint({
  length,
  width,
  points,
}: {
  length: number;
  width: number;
  points: { x: number; y: number }[];
}) {
  const hasPolygon = points.length >= 3;

  if (!hasPolygon && (!length || !width)) return null;

  return (
    <div className="bg-[#131313] border border-[#262626] rounded-3xl p-5 mb-5 overflow-hidden">
      <div className="text-[11px] tracking-[3px] uppercase text-[#777] mb-4">
        Чертёж помещения
      </div>

      <div className="bg-[#0b0b0b] rounded-3xl border border-[#1f1f1f] p-5 overflow-hidden">
        <svg width="100%" height="280" viewBox="0 0 400 280">
          {hasPolygon ? (
            <>
              <polygon
                points={points
                  .map((p) => `${p.x * 35 + 40},${240 - p.y * 35}`)
                  .join(" ")}
                fill="#111827"
                stroke="#d4af68"
                strokeWidth="3"
              />

              {points.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x * 35 + 40}
                    cy={240 - point.y * 35}
                    r="6"
                    fill="#d4af68"
                  />

                  <text
                    x={point.x * 35 + 50}
                    y={240 - point.y * 35 - 10}
                    fill="#ffffff"
                    fontSize="12"
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
            </>
          ) : (
            <>
              <rect
                x="60"
                y="40"
                width={length * 35}
                height={width * 35}
                fill="#111827"
                stroke="#d4af68"
                strokeWidth="3"
                rx="8"
              />

              <text x="65" y="30" fill="#d4af68" fontSize="14">
                {length} м
              </text>

              <text
                x={length * 35 + 80}
                y={width * 18 + 50}
                fill="#d4af68"
                fontSize="14"
              >
                {width} м
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("calc");

  const [clientName, setClientName] = useState("");

  const [shapeMode, setShapeMode] = useState(false);

  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(3);

  const [history, setHistory] = useState<any[]>([]);

  const [shapePoints, setShapePoints] = useState([
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 2 },
    { x: 4, y: 5 },
    { x: 0, y: 4 },
  ]);

  const [materials] = useState([
    {
      id: 1,
      name: "MSD Premium",
      price: 650,
    },
    {
      id: 2,
      name: "Матовый",
      price: 500,
    },
    {
      id: 3,
      name: "Глянец",
      price: 550,
    },
  ]);

  const [selectedMatId, setSelectedMatId] = useState(1);

  const [extras, setExtras] = useState([
    {
      label: "Монтаж",
      price: 0,
    },
  ]);

  const currentMaterial =
    materials.find((m) => m.id === selectedMatId) || materials[0];

  const estimate = useMemo(() => {
    const area = shapeMode
      ? polygonArea(shapePoints)
      : Number(length) * Number(width);

    const extrasCost = extras.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const materialCost = area * currentMaterial.price;

    return {
      area,
      materialCost,
      extrasCost,
      total: materialCost + extrasCost,
    };
  }, [shapeMode, shapePoints, length, width, extras, currentMaterial]);

  const saveEstimateToHistory = () => {
    const item = {
      id: Date.now(),
      clientName,
      total: estimate.total,
      area: estimate.area,
      date: new Date().toLocaleString("ru-RU"),
    };

    setHistory([item, ...history]);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-[#111] border border-[#242424] rounded-[32px] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-[#222]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-black border border-[#2a2a2a] flex items-center justify-center overflow-hidden relative">
                <img
                  src="https://avm-ceiling-systems.github.io/logo.jpg"
                  alt="AVM"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute text-[#d4af68] text-2xl font-black">
                  AVM
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">
                  AVM Ceiling Systems
                </div>

                <div className="text-[#888] text-sm mt-1">
                  Премиальные натяжные потолки
                </div>
              </div>
            </div>

            <a
              href="https://avm-ceiling-systems.github.io"
              target="_blank"
              rel="noreferrer"
              className="border border-[#d4af6840] px-4 py-2 rounded-2xl text-[#d4af68] text-sm"
            >
              Сайт
            </a>
          </div>

          <div className="flex border-b border-[#1f1f1f]">
            {[
              { key: "calc", label: "Расчёт" },
              { key: "history", label: "История" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setScreen(tab.key)}
                className={`flex-1 py-4 transition-all ${
                  screen === tab.key
                    ? "bg-[#d4af68] text-black font-black"
                    : "text-[#777]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {screen === "calc" && (
            <div className="p-5 md:p-8">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <div className="bg-[#131313] border border-[#262626] rounded-3xl p-5 mb-5">
                    <div className="text-[11px] tracking-[3px] uppercase text-[#777] mb-4">
                      Клиент
                    </div>

                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Имя клиента"
                      className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 mb-5">
                    <button
                      onClick={() => setShapeMode(false)}
                      className={`flex-1 rounded-2xl py-4 font-bold ${
                        !shapeMode
                          ? "bg-[#d4af68] text-black"
                          : "bg-[#171717] text-[#777] border border-[#2a2a2a]"
                      }`}
                    >
                      Прямоугольник
                    </button>

                    <button
                      onClick={() => setShapeMode(true)}
                      className={`flex-1 rounded-2xl py-4 font-bold ${
                        shapeMode
                          ? "bg-[#d4af68] text-black"
                          : "bg-[#171717] text-[#777] border border-[#2a2a2a]"
                      }`}
                    >
                      С углами
                    </button>
                  </div>

                  {!shapeMode && (
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        placeholder="Длина"
                        className="bg-[#131313] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                      />

                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        placeholder="Ширина"
                        className="bg-[#131313] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                      />
                    </div>
                  )}

                  {shapeMode && (
                    <div className="bg-[#131313] border border-[#252525] rounded-3xl p-5 mb-5">
                      <div className="text-[11px] uppercase tracking-[3px] text-[#777] mb-4">
                        Редактор углов
                      </div>

                      <div className="space-y-3">
                        {shapePoints.map((point, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-2 gap-3"
                          >
                            <input
                              type="number"
                              value={point.x}
                              onChange={(e) => {
                                const copy = [...shapePoints];
                                copy[index].x = Number(e.target.value);
                                setShapePoints(copy);
                              }}
                              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                              placeholder="X"
                            />

                            <input
                              type="number"
                              value={point.y}
                              onChange={(e) => {
                                const copy = [...shapePoints];
                                copy[index].y = Number(e.target.value);
                                setShapePoints(copy);
                              }}
                              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                              placeholder="Y"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setShapePoints([
                            ...shapePoints,
                            {
                              x:
                                shapePoints[shapePoints.length - 1].x + 1,
                              y:
                                shapePoints[shapePoints.length - 1].y + 1,
                            },
                          ])
                        }
                        className="w-full mt-4 border border-dashed border-[#d4af68] text-[#d4af68] rounded-2xl py-4"
                      >
                        + Добавить угол
                      </button>
                    </div>
                  )}

                  <Blueprint
                    length={length}
                    width={width}
                    points={shapeMode ? shapePoints : []}
                  />
                </div>

                <div>
                  <div className="bg-[#131313] border border-[#252525] rounded-3xl p-6">
                    <div className="text-[11px] uppercase tracking-[3px] text-[#777] mb-4">
                      Материал
                    </div>

                    <select
                      value={selectedMatId}
                      onChange={(e) =>
                        setSelectedMatId(Number(e.target.value))
                      }
                      className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none mb-5"
                    >
                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name} — {material.price} ₽/м²
                        </option>
                      ))}
                    </select>

                    <div className="text-[11px] uppercase tracking-[3px] text-[#777] mb-4">
                      Дополнительно
                    </div>

                    <div className="space-y-3">
                      {extras.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-3"
                        >
                          <input
                            value={item.label}
                            onChange={(e) => {
                              const copy = [...extras];
                              copy[index].label = e.target.value;
                              setExtras(copy);
                            }}
                            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                          />

                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const copy = [...extras];
                              copy[index].price = Number(e.target.value);
                              setExtras(copy);
                            }}
                            className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-4 outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setExtras([
                          ...extras,
                          {
                            label: "",
                            price: 0,
                          },
                        ])
                      }
                      className="w-full mt-4 border border-dashed border-[#d4af68] text-[#d4af68] rounded-2xl py-4"
                    >
                      + Добавить услугу
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-[#d4af6840] rounded-3xl p-8 mt-5 shadow-2xl">
                    <div className="text-[#777] text-sm mb-2 uppercase tracking-[3px]">
                      Итоговая стоимость
                    </div>

                    <div className="text-5xl font-black text-[#d4af68]">
                      {fmt(estimate.total)} ₽
                    </div>

                    <div className="mt-4 text-[#aaa] leading-8">
                      <div>
                        Площадь: {estimate.area.toFixed(2)} м²
                      </div>

                      <div>
                        Материал: {currentMaterial.name}
                      </div>

                      <div>
                        Цена полотна: {fmt(estimate.materialCost)} ₽
                      </div>
                    </div>

                    <button
                      onClick={saveEstimateToHistory}
                      className="w-full mt-6 bg-[#d4af68] text-black py-4 rounded-2xl font-black text-lg"
                    >
                      Сохранить смету
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === "history" && (
            <div className="p-5 md:p-8">
              {history.length === 0 ? (
                <div className="text-center text-[#666] py-20">
                  История пока пустая
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#131313] border border-[#262626] rounded-3xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xl">
                            {item.clientName || "Без имени"}
                          </div>

                          <div className="text-[#777] mt-1 text-sm">
                            {item.date}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[#d4af68] text-2xl font-black">
                            {fmt(item.total)} ₽
                          </div>

                          <div className="text-[#777] text-sm">
                            {item.area.toFixed(2)} м²
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```
