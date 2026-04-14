"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DRINKS_DATA = [
    {
        category: "輕鬆小品",
        drinks: [
            {
                id: 1,
                name: "夏日回憶",
                color: "border-blue-300",
                bgColor: "bg-blue-300",
                gradient: "from-blue-300 to-yellow-300",
                ingredients: ["陳年琴酒", "乾苦艾酒", "苦精", "金箔"],
                desc: "封存了盛夏海風的鹹滋味與夕陽餘暉的甜。這是一場與過去自己的私會，在冰封的記憶中尋找那抹消失的湛藍。"
            },
            {
                id: 2,
                name: "命運",
                color: "border-red-600",
                bgColor: "bg-red-600",
                gradient: "from-red-600 to-rose-950",
                ingredients: ["波本威士忌", "桑葚汁", "煙燻肉桂", "迷迭香"],
                desc: "當輪盤轉動，命運從不在隨機中產生。濃郁的威士忌底蘊中藏著不可言說的計算。這杯酒，是給那些敢於與莊家博弈者的讚歌。"
            },
            {
                id: 3,
                name: "猛毒9502",
                color: "border-fuchsia-400",
                bgColor: "bg-fuchsia-400",
                gradient: "from-purple-900 to-fuchsia-600",
                ingredients: ["龍舌蘭", "薰衣草糖漿", "蝶豆花水", "氣泡"],
                desc: "高濃度的神祕紫色實驗品。它具備成癮的優雅與致命的魅惑，適合那些在城市暗處尋找禁忌樂趣的優雅怪胎。"
            }
        ]
    },
    {
        category: "微醺之夜",
        drinks: [
            {
                id: 4,
                name: "機會",
                color: "border-yellow-400",
                bgColor: "bg-yellow-400",
                gradient: "from-yellow-400 to-sky-400",
                ingredients: ["琴酒", "接骨木花", "青蘋果利口酒", "金箔"],
                desc: "在資本的荒漠中，機會轉瞬即逝。清爽的底色搭配點點金箔，這是一場關於豪賭的誘惑，只有敢於伸手的人才能品嚐到甜頭。"
            },
            {
                id: 5,
                name: "房地產",
                color: "border-amber-600",
                bgColor: "bg-amber-600",
                gradient: "from-amber-700 to-emerald-900",
                ingredients: ["陳年萊姆酒", "焦糖糖漿", "煙燻肉桂", "巧克力苦精"],
                desc: "沉穩如土地，厚重如權力。這杯特調散發著古老莊園的煙燻氣息與成功者的苦味，適合正在構建自己帝國的酒廠大亨。"
            },
            {
                id: 6,
                name: "短島冰茶",
                color: "border-teal-500",
                bgColor: "bg-teal-500",
                gradient: "from-emerald-800 to-slate-900",
                ingredients: ["龍舌蘭", "薰衣草糖漿", "蝶豆花水", "氣泡"],
                desc: "比長島更短，比宿醉更濃。這是在有限時間內追求極致快感的濃縮方案，專為那些不想等待、只想直接進入高潮的享樂主義者準備。"
            }
        ]
    },
    {
        category: "破破爛爛",
        drinks: [
            {
                id: 7,
                name: "環遊世界",
                color: "border-indigo-400",
                bgColor: "bg-indigo-400",
                gradient: "from-indigo-600 to-orange-400",
                ingredients: ["龍舌蘭", "薰衣草糖漿", "蝶豆花水", "氣泡"],
                desc: "即便擁有再多地產與權力，靈魂終究渴望遠方。這杯酒融合了來自五大洲的精粹，在層次分明的味覺流轉中，帶您在深夜裡完成一場不必遠行、卻足以跨越疆界的壯遊。"
            }
        ]
    }
];

function WineGlassIcon({ className, borderClass, bgClass }: { className?: string; borderClass?: string; bgClass?: string }) {
    return (
        <div className={cn("relative flex flex-col items-center", className)}>
            {/* Bowl */}
            <div className={cn(
                "w-12 h-16 border-2 rounded-b-full bg-white/5 backdrop-blur-[2px] mb-[-1px]",
                borderClass || "border-white/40"
            )} />
            {/* Stem */}
            <div className={cn("w-1 h-12", bgClass || "bg-white/30")} />
            {/* Base */}
            <div className={cn("w-10 h-1.5 rounded-full mt-[-1px]", bgClass || "bg-white/30")} />
        </div>
    );
}

export default function DrinkMenu() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const allDrinks = DRINKS_DATA.flatMap(category => category.drinks);
    const currentDrink = allDrinks.find(d => d.id === selectedId);

    return (
        <div className="py-24 px-4 md:px-6 max-w-6xl mx-auto space-y-24">
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="font-serif text-4xl md:text-6xl text-gold text-center mb-16 tracking-[0.3em]"
            >
                特調酒單
            </motion.h3>

            {DRINKS_DATA.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="h-px flex-1 bg-gold/20" />
                        <h4 className="font-serif text-xl md:text-2xl text-gold/80 tracking-widest uppercase">
                            {cat.category}
                        </h4>
                        <div className="h-px flex-1 bg-gold/20" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-8">
                        {cat.drinks.map((drink) => (
                            <motion.div
                                key={drink.id}
                                layoutId={`drink-${drink.id}`}
                                onClick={() => setSelectedId(drink.id)}
                                className="glass-card p-3 md:p-6 cursor-pointer group hover:border-gold transition-colors flex flex-col items-center text-center"
                                whileHover={{ y: -5 }}
                            >
                                <div className={cn(
                                    "w-full aspect-square md:aspect-[3/4] rounded-sm mb-4 md:mb-6 bg-gradient-to-tr shadow-inner flex items-center justify-center relative",
                                    drink.gradient
                                )}>
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] pointer-events-none" />
                                    <WineGlassIcon 
                                        className="scale-50 md:scale-90 opacity-60 group-hover:opacity-100 transition-opacity" 
                                        borderClass={drink.color}
                                        bgClass={drink.bgColor}
                                    />
                                </div>
                                <h4 className="font-serif text-[10px] md:text-xl text-white mb-1 group-hover:text-gold transition-colors line-clamp-1">
                                    {drink.name}
                                </h4>
                                <div className="flex items-center text-gold/60 text-[8px] md:text-sm">
                                    <Info className="w-2 h-2 md:w-4 md:h-4 mr-1 md:mr-2" />
                                    詳情
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            <AnimatePresence>
                {selectedId && currentDrink && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            layoutId={`drink-${selectedId}`}
                            className="glass-card w-full max-w-xl p-6 md:p-8 relative overflow-hidden"
                        >
                            <button 
                                onClick={() => setSelectedId(null)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                <div className={cn(
                                    "w-full md:w-1/2 aspect-square md:aspect-[3/4] rounded-sm bg-gradient-to-tr flex items-center justify-center",
                                    currentDrink.gradient
                                )}>
                                    <WineGlassIcon 
                                        className="scale-100 md:scale-150 opacity-40" 
                                        borderClass={currentDrink.color}
                                        bgClass={currentDrink.bgColor}
                                    />
                                </div>
                                
                                <div className="flex-1 space-y-4 md:space-y-6">
                                    <h4 className="font-serif text-2xl md:text-3xl text-gold">
                                        {currentDrink.name}
                                    </h4>
                                    <p className="text-white/70 italic text-sm md:text-base leading-relaxed">
                                        {currentDrink.desc}
                                    </p>
                                    <div className="space-y-2">
                                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-gold/50">配方 ingredients</span>
                                        <ul className="space-y-1">
                                            {currentDrink.ingredients.map((ing, i) => (
                                                <li key={i} className="text-white flex items-center text-xs md:text-sm">
                                                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-gold rounded-full mr-2 md:mr-3" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
