"use client";

import React from "react";

const DRINKS_DATA = [
    {
        category: "輕鬆小品",
        drinks: [
            {
                id: 1,
                name: "夏日回憶",
                ingredients: ["檸檬", "氣泡", "藍色"],
                desc: "封存了盛夏海風的氣息與檸檬的酸甜。跳躍的氣泡在湛藍中翻湧，這是一場與過去自己的私會，在冰封的記憶中尋找那抹消失的蔚藍。"
            },
            {
                id: 2,
                name: "命運",
                ingredients: ["鳳梨", "酸甜", "氣泡水"],
                desc: "當輪盤轉動，命運總在酸甜交織中展開。熱帶鳳梨的果香藏著不可言說的計算，這杯氣泡特調，是給那些敢於與未知博弈者的清爽讚歌。"
            },
            {
                id: 3,
                name: "猛毒9502",
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
                ingredients: ["草莓", "柳橙", "氣泡水"],
                desc: "在資本的荒漠中，如草莓般甜美的機會轉瞬即逝。柳橙的陽光氣息與氣泡相互碰撞，這是一場清爽的誘惑，只有敢於伸手的人才能品嚐到甜頭。"
            },
            {
                id: 5,
                name: "房地產",
                ingredients: ["濃厚", "金桔", "可樂"],
                desc: "沉穩如土地，濃厚如權力。金桔的微酸與可樂的暢快交織出獨特的霸氣，適合正在構建自己帝國、品味著酸甜苦辣的酒廠大亨。"
            },
            {
                id: 6,
                name: "短島冰茶",
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
                ingredients: ["甘烈", "水果味", "生命之水"],
                desc: "即便擁有再多地產與權力，靈魂終究渴望遠方。甘烈的生命之水融合了繽紛的水果風味，帶您在深夜裡完成一場跨越疆界、強烈而奔放的壯遊。"
            }
        ]
    }
];

export default function DrinkMenu() {
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">第四屆老奶奶酒會 - 酒單</h2>
            
            {DRINKS_DATA.map((cat, catIdx) => (
                <div key={catIdx} className="mb-8">
                    <h3 className="text-xl font-bold border-b pb-2 mb-4">{cat.category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {cat.drinks.map(drink => (
                            <div key={drink.id} className="border p-4 rounded bg-gray-50 text-black">
                                <h4 className="font-bold text-lg mb-2">{drink.name}</h4>
                                <div className="text-sm mb-2">
                                    <strong>成分:</strong> {drink.ingredients.join(', ')}
                                </div>
                                <p className="text-sm text-gray-700">{drink.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
