"use client";

import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <div className="py-32 px-6 max-w-4xl mx-auto text-center space-y-24">
      {/* 3rd Anniversary Intro */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="inline-block px-4 py-1 border border-gold/30 rounded-full text-[10px] tracking-[0.5em] text-gold uppercase mb-4">
          Established 2023
        </div>
        <h3 className="font-serif text-3xl md:text-5xl gold-text tracking-[0.2em] leading-tight">
          老奶奶酒會 3rd
          <br />
          <span className="text-xl md:text-2xl opacity-60">初衷與初心</span>
        </h3>
        <p className="text-white/70 leading-loose tracking-widest font-light text-sm md:text-lg max-w-2xl mx-auto">
            段落文字段落文字段落文字段落文字段落文字<br />
            段落文字段落文字段落文字段落文字段落文字<br />
            段落文字段落文字段落文字段落文字段落文字
        </p>
      </motion.div>

      <div className="h-px w-32 bg-gold mx-auto opacity-20" />

      {/* Event Concept */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="space-y-12"
      >
        <h3 className="font-serif text-3xl text-white tracking-[0.3em]">
          環遊世界的味蕾饗宴
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="glass-card p-10 space-y-6 group hover:bg-gold/5 transition-all">
            <h4 className="text-gold font-serif text-xl tracking-widest flex items-center">
              <span className="w-8 h-px bg-gold/50 mr-4" />
              元素一
            </h4>
            <p className="text-white/50 text-sm leading-relaxed font-light">
                段落文字段落文字段落文字段落文字段落文字<br />
                段落文字段落文字段落文字段落文字段落文字<br />
            </p>
          </div>
          <div className="glass-card p-10 space-y-6 group hover:bg-gold/5 transition-all">
            <h4 className="text-gold font-serif text-xl tracking-widest flex items-center">
              <span className="w-8 h-px bg-gold/50 mr-4" />
              元素二
            </h4>
            <p className="text-white/50 text-sm leading-relaxed font-light">
                段落文字段落文字段落文字段落文字段落文字<br />
                段落文字段落文字段落文字段落文字段落文字<br />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
