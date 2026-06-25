"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Drink = {
    id: number;
    name: string;
    color: string;
    bgColor: string;
    gradient: string;
    ingredients: string[];
    desc: string;
    customBg?: React.ReactNode;
};

type DrinkCategory = {
    category: string;
    drinks: Drink[];
};

const DRINKS_DATA: DrinkCategory[] = [
    {
        category: "輕鬆小品",
        drinks: [
            {
                id: 1,
                name: "夏日回憶",
                color: "border-cyan-200",
                bgColor: "bg-cyan-200",
                gradient: "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500",
                customBg: (
                    <>
                        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-cyan-300 rounded-full blur-[3rem] opacity-60" />
                        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[3rem] opacity-60" />
                    </>
                ),
                ingredients: ["檸檬", "氣泡", "藍色"],
                desc: "封存了盛夏海風的氣息與檸檬的酸甜。跳躍的氣泡在湛藍中翻湧，這是一場與過去自己的私會，在冰封的記憶中尋找那抹消失的蔚藍。"
            },
            {
                id: 2,
                name: "命運",
                color: "border-yellow-200",
                bgColor: "bg-yellow-200",
                gradient: "bg-gradient-to-bl from-yellow-300 via-amber-400 to-orange-500",
                customBg: (
                    <>
                        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-yellow-400 rounded-full blur-[4rem] opacity-50" />
                        <div className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-rose-500 rounded-full blur-[4rem] opacity-40" />
                    </>
                ),
                ingredients: ["鳳梨", "酸甜", "氣泡水"],
                desc: "當輪盤轉動，命運總在酸甜交織中展開。熱帶鳳梨的果香藏著不可言說的計算，這杯氣泡特調，是給那些敢於與未知博弈者的清爽讚歌。"
            },
            {
                id: 3,
                name: "猛毒9502",
                color: "border-purple-300",
                bgColor: "bg-purple-300",
                gradient: "bg-gradient-to-tr from-amber-900 via-purple-900 to-slate-900",
                customBg: (
                    <>
                        <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[3rem] opacity-50" />
                        <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[60%] bg-amber-700 rounded-full blur-[3rem] opacity-50" />
                    </>
                ),
                ingredients: ["麥芽", "回甘", "可樂"],
                desc: "深邃的麥芽香氣掩蓋了快樂水帶來的致命魅惑。入口暢快，尾韻卻帶著令人成癮的回甘，適合那些在城市暗處尋找禁忌樂趣的優雅怪胎。"
            }
        ]
    },
    {
        category: "微醺之夜",
        drinks: [
            {
                id: 4,
                name: "機會",
                color: "border-pink-200",
                bgColor: "bg-pink-200",
                gradient: "bg-gradient-to-tl from-pink-400 via-rose-400 to-orange-400",
                customBg: (
                    <>
                        <div className="absolute -top-[10%] left-[20%] w-[60%] h-[60%] bg-pink-400 rounded-full blur-[3rem] opacity-60" />
                        <div className="absolute -bottom-[10%] right-[20%] w-[60%] h-[60%] bg-orange-400 rounded-full blur-[3rem] opacity-60" />
                    </>
                ),
                ingredients: ["草莓", "柳橙", "氣泡水"],
                desc: "在資本的荒漠中，如草莓般甜美的機會轉瞬即逝。柳橙的陽光氣息與氣泡相互碰撞，這是一場清爽的誘惑，只有敢於伸手的人才能品嚐到甜頭。"
            },
            {
                id: 5,
                name: "房地產",
                color: "border-amber-300",
                bgColor: "bg-amber-300",
                gradient: "bg-gradient-to-br from-yellow-900 via-amber-800 to-stone-900",
                customBg: (
                    <>
                        <div className="absolute top-0 right-[10%] w-[70%] h-[70%] bg-amber-500 rounded-full blur-[4rem] opacity-40" />
                        <div className="absolute bottom-0 left-[10%] w-[70%] h-[70%] bg-yellow-600 rounded-full blur-[4rem] opacity-30" />
                    </>
                ),
                ingredients: ["濃厚", "金桔", "可樂"],
                desc: "沉穩如土地，濃厚如權力。金桔的微酸與可樂的暢快交織出獨特的霸氣，適合正在構建自己帝國、品味著酸甜苦辣的酒廠大亨。"
            },
            {
                id: 6,
                name: "短島冰茶",
                color: "border-orange-200",
                bgColor: "bg-orange-200",
                gradient: "bg-gradient-to-b from-amber-700 via-orange-900 to-stone-800",
                customBg: (
                    <>
                        <div className="absolute -top-[20%] left-0 w-[80%] h-[80%] bg-orange-500 rounded-full blur-[4rem] opacity-40" />
                        <div className="absolute -bottom-[20%] right-0 w-[80%] h-[80%] bg-amber-700 rounded-full blur-[4rem] opacity-50" />
                    </>
                ),
                ingredients: ["少量酒精", "檸檬", "可樂"],
                desc: "比長島更短，卻比清醒更迷人。少量的酒精點綴著檸檬的清香與可樂的暢快，這是在有限時間內追求微醺快感的濃縮方案，專為享樂主義者準備。"
            }
        ]
    },
    {
        category: "破破爛爛",
        drinks: [
            {
                id: 7,
                name: "環遊世界",
                color: "border-emerald-300",
                bgColor: "bg-emerald-300",
                gradient: "bg-blue-950",
                customBg: (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-500 rounded-full blur-[3rem] opacity-80" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-emerald-500 rounded-full blur-[3rem] opacity-80" />
                        <div className="absolute top-[20%] left-[30%] w-[50%] h-[50%] bg-sky-400 rounded-full blur-[2rem] opacity-60" />
                        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-green-400 rounded-full blur-[2rem] opacity-50" />
                    </>
                ),
                ingredients: ["甘烈", "水果味", "生命之水"],
                desc: "即便擁有再多地產與權力，靈魂終究渴望遠方。甘烈的生命之水融合了繽紛的水果風味，帶您在深夜裡完成一場跨越疆界、強烈而奔放的壯遊。"
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
                                    "w-full aspect-square md:aspect-[3/4] rounded-sm mb-4 md:mb-6 shadow-inner flex items-center justify-center relative overflow-hidden",
                                    drink.gradient
                                )}>
                                    {drink.customBg && drink.customBg}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] pointer-events-none z-10" />
                                    <WineGlassIcon 
                                        className="scale-50 md:scale-90 opacity-60 group-hover:opacity-100 transition-opacity relative z-20" 
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
                    <div 
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={`drink-${selectedId}`}
                            className="glass-card w-full max-w-xl p-6 md:p-8 relative overflow-hidden cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                <div className={cn(
                                    "w-full md:w-1/2 aspect-square md:aspect-[3/4] rounded-sm flex items-center justify-center relative overflow-hidden",
                                    currentDrink.gradient
                                )}>
                                    {currentDrink.customBg && currentDrink.customBg}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] pointer-events-none z-10" />
                                    <WineGlassIcon 
                                        className="scale-100 md:scale-150 opacity-40 relative z-20" 
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
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 text-white/40 text-xs md:text-sm tracking-[0.2em]"
                        >
                            點擊空白處以回到上一頁
                        </motion.p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
